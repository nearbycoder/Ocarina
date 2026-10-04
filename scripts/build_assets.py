"""Editable Blender source library and optimized glTF kit for The Bell of Ages.
Run: blender -b --python scripts/build_assets.py
Coordinates in this file: X right, Y depth, Z up; glTF export converts to Y up.
"""
import bpy, bmesh, math, random, json, os
import numpy as np
from mathutils import Vector, Matrix
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/models'
ART = ROOT / 'art/blender'
random.seed(418)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for data in list(bpy.data.materials): bpy.data.materials.remove(data)

# One deliberately restrained surface palette; all models share the atlas.
PALETTE = [
 ('lime plaster',(0.69,0.64,0.51),'plaster'), ('aged oak',(0.24,0.16,0.10),'wood'),
 ('sandstone',(0.47,0.46,0.38),'stone'), ('blue slate',(0.18,0.25,0.27),'slate'),
 ('terracotta',(0.43,0.23,0.15),'slate'), ('oiled leather',(0.22,0.12,0.065),'leather'),
 ('indigo linen',(0.18,0.30,0.32),'cloth'), ('warm skin',(0.66,0.43,0.28),'skin'),
 ('chestnut hair',(0.12,0.067,0.033),'skin'), ('aged brass',(0.49,0.34,0.14),'metal'),
 ('forged iron',(0.13,0.155,0.16),'metal'), ('cut stone',(0.62,0.59,0.49),'stone'),
 ('rust linen',(0.43,0.23,0.13),'cloth'), ('dark recess',(0.035,0.044,0.038),'leather'),
 ('sage paint',(0.28,0.36,0.28),'wood'), ('ivory linen',(0.68,0.64,0.51),'cloth')]
N=1024; S=N//4
albedo=np.ones((N,N,4),dtype=np.float32)
normal=np.ones((N,N,4),dtype=np.float32); rough=np.ones((N,N,4),dtype=np.float32)
rng=np.random.default_rng(123)
yy,xx=np.mgrid[0:S,0:S].astype(np.float32)/S
for idx,(_,base,kind) in enumerate(PALETTE):
    grain=rng.random((S,S)).astype(np.float32)-.5
    field=(np.sin(xx*17+np.sin(yy*13))*np.cos(yy*21)+np.sin(xx*39-yy*31)*.3)
    if kind=='wood':
        rings=np.sin(xx*150+np.sin(yy*7)*4+np.sin(xx*17+yy*3)*9)
        detail=field*.035+rings*.07+grain*.035
        height=rings*.32+grain*.1
    elif kind=='stone':
        detail=field*.07+grain*.10; height=field*.2+grain*.28
    elif kind=='slate':
        layers=np.sin(yy*60+np.sin(xx*17)*2)
        detail=field*.07+layers*.023+grain*.04; height=layers*.2+grain*.18
    elif kind=='cloth':
        weave=(np.sin(xx*S*math.pi)*np.sin(yy*S*math.pi))
        detail=field*.018+grain*.035; height=grain*.12
    elif kind=='plaster':
        detail=field*.025+grain*.032; height=field*.03+grain*.23
    else:
        detail=field*.023+grain*.025; height=grain*.07
    rgb=np.clip(np.array(base)[None,None,:]*(1+detail[:,:,None]),0,1)
    row,col=idx//4,idx%4; sl=(slice(row*S,(row+1)*S),slice(col*S,(col+1)*S))
    albedo[sl][:,:,:3]=rgb
    dy,dx=np.gradient(height)
    norm=np.stack([-dx*1.4,-dy*1.4,np.ones_like(dx)],axis=-1)
    norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
    normal[sl][:,:,:3]=norm*.5+.5
    rough[sl][:,:,:3]=np.clip((.5 if kind=='metal' else .83)+grain[:,:,None]*.09,0,1)
def image_data(name,data,color):
    img=bpy.data.images.new(name,width=N,height=N,alpha=True)
    img.colorspace_settings.name=color
    img.pixels.foreach_set(data.ravel());img.filepath_raw=str(ART/(name+'.png'));img.file_format='PNG';img.save();img.pack()
    img.filepath_raw='//'+name+'.png'  # Keep the saved .blend free of machine-specific paths.
    return img
alb=image_data('alder-surface-color',albedo,'sRGB')
nrm=image_data('alder-surface-normal',normal,'Non-Color')
rgh=image_data('alder-surface-roughness',rough,'Non-Color')
MATS=[]
for name,metal,emit in [('Alder • natural surfaces',0,0),('Alder • forged metal',.7,0),('Alder • warm glass',0,1)]:
    m=bpy.data.materials.new(name);m.use_nodes=True
    nt=m.node_tree; p=nt.nodes.get('Principled BSDF');p.inputs['Metallic'].default_value=metal
    for img,socket in [(alb,'Base Color'),(rgh,'Roughness')]:
        node=nt.nodes.new('ShaderNodeTexImage');node.image=img;nt.links.new(node.outputs['Color'],p.inputs[socket])
    tex=nt.nodes.new('ShaderNodeTexImage');tex.image=nrm
    bump=nt.nodes.new('ShaderNodeNormalMap');bump.inputs['Strength'].default_value=.55
    nt.links.new(tex.outputs['Color'],bump.inputs['Color']);nt.links.new(bump.outputs['Normal'],p.inputs['Normal'])
    if emit:
        p.inputs['Base Color'].default_value=(.25,.12,.03,1)
        p.inputs['Emission Color'].default_value=(.8,.37,.09,1);p.inputs['Emission Strength'].default_value=.5
    MATS.append(m)

class Part:
    def __init__(self,name,parent=None,pivot=(0,0,0)):
        self.obj=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(self.obj)
        self.obj.parent=parent;self.obj.location=pivot
        self.v=[];self.f=[];self.uv=[];self.mi=[]
    def add(self,vs,fs,tile,transform=None):
        vs=[Vector(v) for v in vs]
        lo=[min(v[i] for v in vs) for i in range(3)]; hi=[max(v[i] for v in vs) for i in range(3)]
        start=len(self.v)
        self.v.extend([tuple(transform@v if transform is not None else v) for v in vs])
        for face in fs:
            if len(face)<3:continue
            a,b,c=[vs[k] for k in face[:3]];n=(b-a).cross(c-a)
            axis=max(range(3),key=lambda k:abs(n[k])); axes=[k for k in range(3) if k!=axis]
            # Wood grain follows the long axis of each cut piece.
            if hi[axes[0]]-lo[axes[0]]>hi[axes[1]]-lo[axes[1]]:axes.reverse()
            self.f.append(tuple(start+k for k in face));self.mi.append(1 if tile in (9,10) else 0)
            for k in face:
                u=(vs[k][axes[0]]-lo[axes[0]])/max(.001,hi[axes[0]]-lo[axes[0]])
                v=(vs[k][axes[1]]-lo[axes[1]])/max(.001,hi[axes[1]]-lo[axes[1]])
                self.uv.append(((tile%4+.025+u*.95)/4,(tile//4+.025+v*.95)/4))
    def finish(self):
        if not self.v:return
        me=bpy.data.meshes.new(self.obj.name+' • topology');me.from_pydata(self.v,[],self.f);me.update()
        ob=bpy.data.objects.new(self.obj.name+' • mesh',me);bpy.context.collection.objects.link(ob);ob.parent=self.obj
        for m in MATS[:2]:me.materials.append(m)
        uv=me.uv_layers.new(name='Surface atlas')
        uv.data.foreach_set('uv',np.array(self.uv,dtype=np.float32).ravel())
        for p,mi in zip(me.polygons,self.mi):p.material_index=mi;p.use_smooth=True
        me.set_sharp_from_angle(angle=math.radians(55))
        tri=ob.modifiers.new("Export triangulation", "TRIANGULATE")
        tri.min_vertices=5
        if hasattr(tri,"keep_custom_normals"):tri.keep_custom_normals=True
        return ob
PARTS=[]; ROOTS=[]
def part(name,parent=None,pivot=(0,0,0)):
    p=Part(name,parent,pivot);PARTS.append(p);return p

def model(name):
    p=part(name);ROOTS.append(p.obj);return p

def trans(pos=(0,0,0),rot=(0,0,0)):
    from mathutils import Euler
    return Matrix.Translation(pos)@Euler(rot).to_matrix().to_4x4()
_cache={}
def cube(p,pos,scale,tile=1,bevel=.025,rot=(0,0,0)):
    key=tuple(round(x,4) for x in (*scale,bevel))
    if key not in _cache:
        bm=bmesh.new();bmesh.ops.create_cube(bm,size=1)
        for v in bm.verts:v.co.x*=scale[0];v.co.y*=scale[1];v.co.z*=scale[2]
        if bevel>0:bmesh.ops.bevel(bm,geom=list(bm.edges),offset=min(bevel,min(scale)*.24),segments=1,affect='EDGES')
        bm.verts.ensure_lookup_table();_cache[key]=([tuple(v.co) for v in bm.verts],[tuple(v.index for v in f.verts) for f in bm.faces]);bm.free()
    vs,fs=_cache[key];p.add(vs,fs,tile,trans(pos,rot))

def lathe(p,profile,tile=2,n=16,pos=(0,0,0),rot=(0,0,0)):
    vs=[(r*math.cos(i*math.tau/n),r*math.sin(i*math.tau/n),z) for z,r in profile for i in range(n)]
    fs=[]
    for j in range(len(profile)-1):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n;fs.append((a,b,b+n,a+n))
    fs.append(tuple(reversed(range(n))));fs.append(tuple((len(profile)-1)*n+i for i in range(n)))
    p.add(vs,fs,tile,trans(pos,rot))
def ellipsoid(p,pos,radii,tile,n=16,rings=10):
    vs=[]
    for j in range(rings+1):
        a=math.pi*(.002+(j/rings)*.996)
        for i in range(n):
            b=i*math.tau/n;vs.append((math.sin(a)*math.cos(b)*radii[0],math.sin(a)*math.sin(b)*radii[1],math.cos(a)*radii[2]))
    fs=[]
    for j in range(rings):
        for i in range(n):a=j*n+i;b=j*n+(i+1)%n;fs.append((a,b,b+n,a+n))
    p.add(vs,[tuple(reversed(f)) for f in fs],tile,trans(pos))
def beam(p,a,b,width,depth=None,tile=1,bevel=.025):
    a,b=Vector(a),Vector(b);d=b-a
    vs,fs=None,None
    # Create along local Z then orient into the joinery.
    q=d.to_track_quat('Z','Y').to_euler()
    cube(p,(a+b)/2,(width,depth or width,d.length),tile,bevel,q)
def arch(p,cx,y,base,radius,thickness,depth,tile=11,steps=13):
    for i in range(steps):
        a=i*math.pi/steps+.014;b=(i+1)*math.pi/steps-.014
        vs=[]
        for yy in [y-depth/2,y+depth/2]:
            for r,t in [(radius,a),(radius,b),(radius+thickness,b),(radius+thickness,a)]:vs.append((cx+math.cos(t)*r,yy,base+math.sin(t)*r))
        p.add(vs,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],tile)
def roof(p,width,depth,z,height,tile=3,cx=0,cy=0,rows=9):
    # Discrete, gently bowed slate shingles with overlapping courses and ragged eaves.
    slope=math.atan2(height,width/2);length=math.hypot(width/2,height)
    cols=max(4,int(depth/.42))
    for side in [-1,1]:
        for row in range(rows):
            t=(row+.5)/rows;x=side*width*.5*t
            zz=z+height*(1-t)+.04*math.sin(t*math.pi)
            for col in range(cols):
                yy=cy-depth/2+(col+.5)*depth/cols+(row%2)*.065
                cube(p,(cx+x,yy,zz+random.uniform(-.022,.022)),(length/rows+.075,depth/cols-.018,.09),tile,.024,(0,side*slope,random.uniform(-.008,.008)))
    for side in [-1,1]:
        for yy in [cy-depth/2-.09,cy+depth/2+.09]:
            beam(p,(cx,yy,z+height+.05),(cx+side*width/2,yy,z-.08),.16,.2,1,.035)
    for j in range(cols):
        lathe(p,[(0,.14),(.19,.14)],tile,8,(cx,cy-depth/2+(j+.5)*depth/cols,z+height+.1),(math.pi/2,0,0))

def window(p,x,y,z,w=.9,h=1.2,shutters=True):
    cube(p,(x,y,z),(w+.18,.17,h+.18),1,.04)
    cube(p,(x,y-.11,z),(w-.03,.055,h-.04),13,.01)
    for xx in [-1,1]:
        for zz in [-1,1]:cube(p,(x+xx*w*.235,y-.15,z+zz*h*.235),(w*.41,.025,h*.41),9,.007)
    cube(p,(x,y-.20,z),(.055,.08,h),1,.008);cube(p,(x,y-.20,z),(w,.08,.07),1,.008)
    cube(p,(x,y-.10,z-h/2-.12),(w+.34,.38,.15),11,.03)
    if shutters:
        for side in [-1,1]:
            sx=x+side*(w*.5+.29)
            for j in range(3):cube(p,(sx+(j-1)*.14,y,z),(.133,.12,h+.10),14,.014)
            for zz in [-h*.32,h*.32]:cube(p,(sx,y-.09,z+zz),(.46,.055,.08),1,.01)

def door(p,x,y,z=0,w=1.2,h=2.1):
    cube(p,(x,y,z+h/2),(w+.24,.19,h+.15),1,.055)
    for i in range(6):cube(p,(x+(i-2.5)*(w/6),y-.12,z+h/2),(w/6-.012,.09,h),14,.015)
    for zz in [.34,h-.38]:cube(p,(x,y-.19,z+zz),(w*.94,.055,.085),10,.014)
    ellipsoid(p,(x+w*.31,y-.25,z+h*.48),(.055,.045,.055),9,12,6)
    for i in range(3):cube(p,(x,y-.4-i*.25,z+.12-i*.065),(w+.45+i*.22,.58,.18),2,.035)

def cottage(name,variant=0):
    p=model(name);w=6.0;d=5.0;h=3.85
    cube(p,(0,0,2.08),(w,d,3.58),0,.06)
    # Foundation has individually cut courses; no brick wallpaper wrapped around a cube.
    for z in [.18,.49]:
        for yy in [-2.52,2.52]:
            for j in range(8):cube(p,(-2.69+j*.77+(z>.3)*.12,yy,z),(.74,.34,.29),2,.045)
        for xx in [-3.02,3.02]:
            for j in range(7):cube(p,(xx,-2.2+j*.72,z),(.32,.7,.29),2,.038)
    for yy in [-2.56,2.56]:
        p.add([(-3,yy,h),(3,yy,h),(0,yy,h+2.55)],[(0,1,2)],0)
        for xx in [-2.9,0,2.9]:cube(p,(xx,yy,2.22),(.18,.20,3.47),1,.03)
        for z in [.78,3.82]:cube(p,(0,yy,z),(6.18,.23,.20),1,.026)
        beam(p,(-2.9,yy,3.86),(0,yy,6.35),.18,.2)
        beam(p,(2.9,yy,3.86),(0,yy,6.35),.18,.2)
        beam(p,(0,yy,3.86),(0,yy,6.35),.16,.19)
        for side in [-1,1]:beam(p,(side*2.9,yy,2.6),(side*1.65,yy,3.72),.14,.19)
    for xx in [-3.04,3.04]:
        for zz in [.8,3.82]:cube(p,(xx,0,zz),(.22,5.15,.19),1,.025)
        for yy in [-1.4,1.25]:cube(p,(xx,yy,2.3),(.22,.17,3.05),1,.025)
    roof(p,7.15,6.15,3.93,2.7,3 if variant==0 else 4)
    door(p,-.3 if variant else 0,-2.67,.36)
    for x in [-1.98,1.98]:window(p,x,-2.66,2.4,.86,1.17)
    window(p,0,-2.67,4.72,.68,.82,False)
    # Tall coursed chimney and soot-dark open throat.
    for j in range(12):
        z=3.5+j*.31
        cube(p,(1.83,1.1,z),(.72+(j%2)*.035,.78,.295),2,.04)
    cube(p,(1.83,1.1,7.15),(.95,1.0,.22),11,.035)
    cube(p,(1.83,1.1,7.27),(.58,.65,.045),13,.006)
    # Entry canopy and braces.
    for xx in [-1.10,1.10]:
        cube(p,(xx,-3.25,1.6),(.15,.15,2.6),1,.026)
        beam(p,(xx,-3.25,2.2),(xx,-2.58,3.0),.12)
    roof(p,2.72,1.53,2.9,.56,3 if variant==0 else 4,cy=-3.12,rows=4)
    # Side window set into an actual timber frame, plus stone doorstep.
    for yy in [-.95,1.05]:
        cube(p,(3.10,yy,2.24),(.11,1.0,1.2),1,.025)
        cube(p,(3.17,yy,2.24),(.06,.8,1.02),13,.012)
        cube(p,(3.21,yy,2.24),(.05,.07,1.0),1,.009)
        cube(p,(3.21,yy,2.24),(.05,.8,.07),1,.009)
    if variant:
        # A modest side shop and canopy break the repeated house silhouette.
        cube(p,(-3.7,.1,1.45),(1.5,3.5,2.5),0,.05)
        for yy in [-1.68,1.88]:cube(p,(-4.46,yy,1.5),(.16,.19,2.7),1,.02)
        for j in range(6):
            cube(p,(-3.75,-1.72,1.13+j*.22),(1.5,.15,.205),1,.015)
        roof(p,2.05,4.05,2.7,.65,4,cx=-3.68,cy=.1,rows=5)
    # Window boxes with individual stems and small petalled flower heads.
    for xx in [-1.98,1.98]:
        cube(p,(xx,-2.94,1.60),(1.12,.37,.26),1,.025)
        cube(p,(xx,-2.94,1.745),(.98,.29,.02),13,.003)
        for j in range(7):
            fx=xx+(j-3)*.13;fz=1.85+random.random()*.18
            beam(p,(fx,-2.94,1.72),(fx,-2.94,fz),.018,tile=14,bevel=.002)
            for k in range(5):
                a=k*math.tau/5
                ellipsoid(p,(fx+math.cos(a)*.04,-2.94+math.sin(a)*.04,fz),(.04,.035,.018),15 if j%2 else 12,6,3)
    return p

cottage('Cottage_Slate' ,0);cottage('Cottage_Terracotta',1)

p=model('Well')
for row in range(3):
    for i in range(16):
        a=(i+row*.5)*math.tau/16
        cube(p,(math.cos(a)*1.18,math.sin(a)*1.18,.16+row*.29),(.47,.35,.27),2,.04,(0,0,a+math.pi/2))
for i in range(16):
    a=i*math.tau/16;cube(p,(math.cos(a)*1.18,math.sin(a)*1.18,.96),(.48,.45,.18),11,.035,(0,0,a+math.pi/2))
for x in [-1.5,1.5]:
    cube(p,(x,0,1.8),(.19,.23,3.6),1,.035)
    beam(p,(x,0,2.8),(x,-.63,3.5),.14)
beam(p,(-1.6,0,2.4),(1.7,0,2.4),.18,tile=1)
lathe(p,[(0,.12),(.7,.12)],5,12,(0,0,2.4),(0,math.pi/2,0))
beam(p,(.05,-.02,2.35),(.05,-.02,.35),.025,tile=5,bevel=.004)
roof(p,3.8,2.2,3.4,.9,3,rows=5)
lathe(p,[(0,.26),(.05,.28),(.43,.34),(.48,.34)],1,12,(.95,-1.5,.04))
for z in [.10,.4]:lathe(p,[(z,.285+z*.1),(z+.035,.285+z*.1)],10,12,(.95,-1.5,.04))

p=model('Barrel')
for i in range(14):
    a=i*math.tau/14
    profile=[(0,.35),(.09,.38),(.30,.43),(.56,.44),(.85,.40),(.96,.36)]
    vs=[]
    for z,r in profile:
        for aa in [a+.012,a+math.tau/14-.012]:vs.append((r*math.cos(aa),r*math.sin(aa),z))
    fs=[(j*2,j*2+1,j*2+3,j*2+2) for j in range(len(profile)-1)]
    p.add(vs,fs,1)
for z,r in [(.13,.399),(.75,.432)]:lathe(p,[(z,r),(z+.065,r)],10,28)
lathe(p,[(.01,.35),(.025,.35),(.94,.353),(.955,.353)],1,24)

p=model('Crate')
for side in [-1,1]:
    for i in range(5):
        cube(p,((i-2)*.2,side*.49,.5),(.19,.075,.94),1,.016)
        cube(p,(side*.49,(i-2)*.2,.5),(.075,.19,.94),1,.016)
    for z in [.08,.92]:
        cube(p,(0,side*.54,z),(1.08,.07,.11),1,.015)
        cube(p,(side*.54,0,z),(.07,1.08,.11),1,.015)
    beam(p,(-.43,side*.55,.15),(.43,side*.55,.86),.10,.045)
for i in range(5):cube(p,((i-2)*.2,0,.97),(.19,.98,.07),1,.015)

p=model('Chest')
for i in range(7):cube(p,((i-3)*.18,0,.4),(.17,.82,.63),1,.02)
# Barrel-vault lid, modeled as bent boards.
for i in range(9):
    a=(i+.5)*math.pi/9
    cube(p,(0,math.cos(a)*.43,.7+math.sin(a)*.25),(1.35,.16,.07),1,.018,(a-math.pi/2,0,0))
for x in [-.48,.48]:
    cube(p,(x,-.438,.43),(.10,.065,.7),9,.012)
    cube(p,(x,.438,.43),(.10,.065,.7),9,.012)
    for i in range(12):
        a=(i+.5)*math.pi/12
        cube(p,(x,math.cos(a)*.46,.7+math.sin(a)*.28),(.105,.13,.04),9,.01,(a-math.pi/2,0,0))
cube(p,(0,-.47,.65),(.20,.085,.29),9,.025)
cube(p,(0,-.52,.65),(.04,.018,.095),13,.005)

p=model('Fence')
for x in [-1.1,1.1]:
    cube(p,(x,0,.61),(.17,.20,1.22),1,.028,(0,random.uniform(-.025,.025),0))
    cube(p,(x,0,1.25),(.2,.23,.12),1,.025)
for z in [.43,.94]:beam(p,(-1.12,0,z),(1.12,0,z+.05),.10,.16)
beam(p,(-1.05,.02,.45),(1.05,.02,.98),.08,.09)

p=model('Cart')
for i in range(7):cube(p,((i-3)*.2,0,.7),(.19,2.0,.13),1,.016)
for side in [-1,1]:
    for z in [.95,1.19,1.43]:cube(p,(side*.76,0,z),(.1,2.0,.19),1,.02)
    for y in [-.91,.91]:cube(p,(side*.76,y,1.15),(.15,.15,1.0),1,.02)
    beam(p,(side*.7,-.6,.65),(side*.7,-3.1,.45),.10,.13)
    # Wheel lies in YZ plane, with twelve spokes and an iron tire.
    for i in range(12):
        a=i*math.tau/12
        beam(p,(side*.98,0,.55),(side*.98,math.cos(a)*.56,.55+math.sin(a)*.56),.055,tile=1,bevel=.008)
    for i in range(24):
        a=i*math.tau/24;b=(i+1)*math.tau/24
        beam(p,(side*.98,math.cos(a)*.57,.55+math.sin(a)*.57),(side*.98,math.cos(b)*.57,.55+math.sin(b)*.57),.09,.12,10,.009)

p=model('Signpost')
cube(p,(0,0,1.3),(.16,.17,2.6),1,.025)
for z,a in [(2.12,-.07),(1.74,.09)]:cube(p,(0,0,z),(1.55,.15,.26),1,.025,(0,a,0))
for i in range(3):cube(p,(-.18+i*.18,-.085,2.12),(.055,.02,.14),15,.003,(0,.2,0))

p=model('Portal')
for side in [-1,1]:
    for row in range(12):
        cube(p,(side*3.3,0,.3+row*.51),(1.35+(row%3)*.05,2.2,.49),2,.075)
    for z in [.20,1.1,5.9]:cube(p,(side*3.3,0,z),(1.75,2.5,.25),11,.05)
arch(p,0,0,5.9,2.62,.83,2.2,11,17)
arch(p,0,-1.18,5.9,2.50,.17,.14,9,19)
for j in range(3):cube(p,(0,-.75-j*.45,.16-j*.075),(8.1+j*.35,3,.19),2,.045)
# Keystone carved crest.
cube(p,(0,-1.28,8.88),(.62,.36,.94),11,.09)
for a in [-.55,.55]:beam(p,(0,-1.49,8.5),(math.sin(a)*.22,-1.49,8.85),.055,tile=9,bevel=.008)

p=model('Dungeon_Pier')
for z,w in [(.15,1.55),(.40,1.33),(5.7,1.5),(6.0,1.85)]:cube(p,(0,0,z),(w,w,.30),11,.05)
for row in range(10):cube(p,(0,0,.85+row*.47),(1.0,1.02,.45),2,.045)
for side in [-1,1]:cube(p,(side*.43,-.55,3),(.12,.17,4.75),11,.03)
cube(p,(0,-.69,3.85),(.35,.31,.17),10,.025)
lathe(p,[(0,.16),(.27,.24),(.36,.29)],9,12,(0,-.82,3.87))

p=model('Bell_Sanctuary')
for z,r in [(.12,9.8),(.37,9.2),(.58,7.9)]:lathe(p,[(z-.11,r),(z+.11,r)],2,64)
for i in range(7):
    a=math.pi/7*i+math.pi/14
    # Semi-circular colonnade open toward the village (Blender -Y).
    x,y=math.cos(a)*6.8,math.sin(a)*6.8-1.3
    lathe(p,[(0,.86),(.25,.86),(.38,.67),(.58,.63),(6.4,.48),(6.62,.65),(6.87,.70)],11,16,(x,y,.65))
    cube(p,(x,y,7.58),(1.7,1.7,.32),2,.05)
# Two front bell piers frame the actual hanging instrument.
for side in [-1,1]:
    for j in range(13):cube(p,(side*3.2,-.6,.9+j*.51),(1.17,1.38,.49),11,.06)
    cube(p,(side*3.2,-.6,7.63),(1.6,1.7,.34),11,.05)
arch(p,0,-.6,7.52,2.62,.52,1.2,11,17)
beam(p,(-3,-.6,7.42),(3,-.6,7.42),.35,.4,1)
lathe(p,[(0,1.42),(.12,1.48),(.22,1.37),(.45,1.06),(1.3,.70),(2.0,.57),(2.21,.40),(2.32,.18)],9,40,(0,-.6,4.7))
for z,r in [(4.82,1.48),(5.13,1.15),(6.60,.62)]:lathe(p,[(z,r),(z+.055,r)],9,40,(0,-.6,0))
beam(p,(0,-.6,7.45),(0,-.6,6.98),.12,tile=10)
beam(p,(0,-.6,5.15),(0,-.6,4.36),.09,tile=10)
ellipsoid(p,(0,-.6,4.34),(.22,.22,.26),9)
# Engraved radial pavement and quiet brass inlays.
for i in range(24):
    a=i*math.tau/24
    beam(p,(math.cos(a)*4.7,math.sin(a)*4.7,.704),(math.cos(a)*6.6,math.sin(a)*6.6,.704),.026,.015,9,.003)
cube(p,(0,-4,1.10),(1.9,1.25,.9),2,.07)
cube(p,(0,-4,1.60),(2.12,1.45,.2),11,.04)

p=model('Watchtower')
for row in range(26):
    r=2.8-row*.032
    for i in range(20):
        a=(i+.5*(row%2))*math.tau/20
        cube(p,(math.cos(a)*r,math.sin(a)*r,.24+row*.48),(.9,.45,.46),2,.045,(0,0,a+math.pi/2))
for z,r in [(0,3.05),(.4,2.98),(12.7,2.8),(13,2.95)]:lathe(p,[(z,r),(z+.23,r)],11,32)
for i in range(12):
    a=i*math.tau/12;beam(p,(math.cos(a)*2.65,math.sin(a)*2.65,13.1),(math.cos(a)*2.65,math.sin(a)*2.65,14.35),.10,tile=10)
lathe(p,[(14.28,2.75),(14.4,2.75)],10,24)
for i in range(8):
    a=i*math.tau/8;beam(p,(math.cos(a)*1.7,math.sin(a)*1.7,13.2),(math.cos(a)*1.7,math.sin(a)*1.7,15.5),.14,tile=1)
lathe(p,[(15.5,3.2),(15.65,3.2),(18.1,.15),(18.3,0)],3,24)
door(p,0,-2.98,.2,1.25,2.4)

# Authored rock forms: perturbed rings with broad fractured planes, no smooth potatoes.
for variant in range(3):
    p=model('Rock_'+str(variant));vs=[];n=12
    for row,(z,r) in enumerate([(-.18,.72),(.18,1.0),(.76,.94),(1.35,.56),(1.54,.16)]):
        for i in range(n):
            a=i*math.tau/n+.13*row;rr=r*random.uniform(.83,1.14)
            vs.append((math.cos(a)*rr+row*.055,math.sin(a)*rr*.78,z+random.uniform(-.13,.13)))
    fs=[]
    for j in range(4):
        for i in range(n):a=j*n+i;b=j*n+(i+1)%n;fs.append((a,b,b+n,a+n))
    fs.append(tuple(range(48,60)));p.add(vs,fs,2 if variant<2 else 11)

# A branching trunk with visible roots. Reused through instancing at runtime.
p=model('Alder_Trunk')
lathe(p,[(0,.53),(.28,.43),(1.5,.27),(3.1,.22),(4.5,.14),(5.9,.055)],1,10)
for i in range(6):
    a=i*2.399
    beam(p,(math.cos(a)*.17,math.sin(a)*.17,.70),(math.cos(a)*1.08,math.sin(a)*1.08,.07),.22,.17,1)
    beam(p,(0,0,2.6+i*.4),(math.cos(a)*1.6,math.sin(a)*1.6,4.6+i*.21),.18,.13,1)
    beam(p,(math.cos(a)*1.5,math.sin(a)*1.5,4.5+i*.21),(math.cos(a+.4)*2.1,math.sin(a+.4)*2.1,5.5+i*.16),.08,.06,1)

# Characters use modeled ring topology, layered clothing and local limb pivots.
# The game retains its tested procedural animation, with Blender-authored mesh parts.
def garment(p,rings,tile,n=20):
    vs=[]
    for z,rx,ry,cy in rings:
        for i in range(n):
            a=i*math.tau/n;fold=1+.025*math.cos(a*6)
            vs.append((math.cos(a)*rx*fold,cy+math.sin(a)*ry*fold,z))
    fs=[]
    for j in range(len(rings)-1):
        for i in range(n):a=j*n+i;b=j*n+(i+1)%n;fs.append((a,b,b+n,a+n))
    fs.append(tuple(reversed(range(n))));fs.append(tuple((len(rings)-1)*n+i for i in range(n)))
    if rings[1][0] < rings[0][0]:fs=[tuple(reversed(f)) for f in fs]
    p.add(vs,fs,tile)

def hero(name,adult=False,role=None):
    root=model(name);body=part(name+'_Body',root.obj,(0,0,.95))
    outfit=15 if role=='elder' else 12 if role=='mira' else 1 if role=='smith' else 6
    hairtile=15 if role=='elder' else 8
    # Tunic silhouette narrows at waist, broadens through the shoulder and split hem.
    garment(body,[(.63,.33,.21,0),(.69,.34,.215,0),(.91,.26,.17,0),(1.06,.27,.18,0),(1.25,.34,.19,0),(1.34,.30,.17,0),(1.40,.16,.14,0)],outfit)
    garment(body,[(.87,.276,.182,0),(.95,.277,.183,0)],5)
    cube(body,(0,.19,.912),(.12,.035,.105),9,.018)
    garment(body,[(1.32,.28,.19,0),(1.42,.18,.15,0),(1.46,.14,.13,0)],12)
    # Scarf tail tapers with a slight cloth bend.
    body.add([(-.16,.21,1.36),(-.04,.22,1.36),(-.09,.235,1.01),(-.22,.24,.94),(-.23,.23,1.16)],[(0,1,2,3,4)],12)
    lathe(body,[(1.37,.10),(1.55,.11)],7,16)
    head_start=len(body.v)
    # Head has a jaw, cheek plane and distinct brow, rather than a single sphere.
    garment(body,[(1.47,.105,.105,.015),(1.51,.16,.135,.025),(1.60,.21,.17,.01),(1.73,.225,.188,0),(1.85,.21,.17,-.005),(1.93,.14,.115,-.02),(1.955,.03,.025,-.02)],7,24)
    for side in [-1,1]:
        ellipsoid(body,(side*.218,.005,1.71),(.052,.057,.087),7,12,8)
        ellipsoid(body,(side*.22,.048,1.715),(.023,.018,.044),12,10,6)
        # Small whites, iris, upper eyelid and angled eyebrows.
        ellipsoid(body,(side*.081,.166,1.744),(.044,.017,.027),15,12,8)
        ellipsoid(body,(side*.080,.182,1.744),(.021,.007,.023),14,12,8)
        ellipsoid(body,(side*.080,.189,1.744),(.010,.004,.017),13,10,6)
        beam(body,(side*.032,.190,1.792),(side*.137,.173,1.803),.026,.026,8,.005)
    ellipsoid(body,(0,.177,1.675),(.034,.037,.047),7,12,8)
    beam(body,(-.047,.174,1.60),(.047,.174,1.60),.012,.014,12,.002)
    # The protagonist needs an actual occipital/nape silhouette from the chase
    # camera. A horizontal cap at brow height leaves the entire rear scalp bare.
    if role is None:
        vs=[];fs=[];around=32
        for row,(z,rx,ry,cy) in enumerate([
            (1.68,.242,.198,-.014),
            (1.81,.250,.210,-.018),
            (1.91,.223,.188,-.025),
            (1.985,.133,.112,-.035),
            (2.025,.012,.012,-.040),
        ]):
            for i in range(around):
                a=i*math.tau/around
                # Face is +Y: keep the brow clear, cover the back down to the
                # nape, and soften the lower edge with small uneven hair tips.
                zz=z+(.12*math.sin(a)+.009*math.cos(a*7) if row==0 else 0)
                relief=1+.012*math.cos(a*9+row*.5)
                vs.append((math.cos(a)*rx*relief,cy+math.sin(a)*ry*relief,zz))
        for row in range(4):
            for i in range(around):
                a=row*around+i;b=row*around+(i+1)%around
                fs.append((a,b,b+around,a+around))
        fs.append(tuple(4*around+i for i in range(around)))
        body.add(vs,fs,hairtile)
        # Five shallow, overlapping locks give the rear hair a swept shape
        # instead of a smooth helmet. They taper into the irregular neckline.
        for i in range(5):
            x=(i-2)*.071;vs=[];fs=[];steps=5;sides=6
            for j in range(steps):
                t=j/(steps-1);width=.049*(1-.91*t)
                for k in range(sides):
                    a=k*math.tau/sides
                    vs.append((x+t*.024+math.cos(a)*width,
                               -.195-.035*math.sin(t*math.pi)-math.sin(a)*width*.40,
                               1.855-t*(.295-.027*abs(i-2))))
            for j in range(steps-1):
                for k in range(sides):
                    a=j*sides+k;b=j*sides+(k+1)%sides
                    fs.append((a,b,b+sides,a+sides))
            body.add(vs,fs,hairtile)
    else:
        garment(body,[(1.78,.225,.184,-.016),(1.88,.229,.185,-.02),(1.975,.145,.12,-.028),(2.01,.015,.015,-.04)],hairtile,24)
    for i in range(7):
        # Tapered convex locks sweep across the forehead, with closed volume.
        x=-.18+i*.052; z=1.895+.035*math.sin(i*.53)
        vs=[]; steps=5; around=8
        for j in range(steps):
            t=j/(steps-1);width=.045*(1-t*.84)
            for k in range(around):
                a=k*math.tau/around
                vs.append((x+t*.07+math.cos(a)*width,.115+t*.068+math.sin(a)*width*.45,z+.09-t*.155))
        fs=[]
        for j in range(steps-1):
            for k in range(around):
                a=j*around+k;b=j*around+(k+1)%around;fs.append((a,b,b+around,a+around))
        body.add(vs,fs,hairtile)
    for side in [-1,1]:
        ellipsoid(body,(side*.208,-.048,1.78),(.061,.125,.14),hairtile,12,8)
    if role is None:
        # More restrained proportions, retaining an expressive child silhouette.
        head_scale=.84 if not adult else .79
        for i in range(head_start,len(body.v)):
            x,y,z=body.v[i];body.v[i]=(x*head_scale,y*head_scale,1.47+(z-1.47)*head_scale)
    if role is None:
        # Small travel pack and straps, with buckles and stitched flap.
        cube(body,(0,-.25,1.11),(.42,.22,.47),5,.06)
        cube(body,(0,-.385,1.23),(.40,.055,.21),1,.04)
        for side in [-1,1]:
            beam(body,(side*.21,.19,1.33),(side*.19,.19,.97),.049,.025,5,.006)
            cube(body,(side*.18,-.425,1.12),(.047,.022,.13),9,.009)
    if role=='elder':
        garment(body,[(.08,.36,.25,0),(.16,.37,.25,0),(.68,.30,.20,0),(.91,.265,.18,0)],15)
        for side in [-1,1]:
            ellipsoid(body,(side*.115,.135,1.57),(.12,.08,.14),15,16,8)
        garment(body,[(1.29,.04,.03,.16),(1.40,.12,.045,.175),(1.56,.145,.067,.16)],15,16)
        beam(body,(.48,.07,.02),(.48,.07,1.6),.055,tile=1)
        ellipsoid(body,(.48,.07,1.65),(.09,.08,.11),1,12,8)
    if role=='mira':
        for side in [-1,1]:
            for j in range(5):ellipsoid(body,(side*.23,-.04,1.76-j*.09),(.055,.065,.08),8,12,6)
        garment(body,[(.40,.33,.22,0),(.45,.34,.23,0),(.77,.28,.19,0),(.90,.26,.18,0)],12)
    if role=='smith':
        body.add([(-.18,.202,1.28),(.18,.202,1.28),(.23,.232,.54),(-.23,.232,.54)],[(0,1,2,3)],5)
        for side in [-1,1]:beam(body,(side*.15,.212,1.29),(side*.20,.17,1.42),.034,.025,5,.007)
        cube(body,(.22,.15,.87),(.12,.06,.23),10,.02)
        cube(body,(.24,.15,.68),(.27,.12,.12),10,.03)
    legs=[];arms=[]
    for side,label in [(-1,'L'),(1,'R')]:
        leg=part(name+'_Leg'+label,root.obj,(side*.165,0,.67));legs.append(leg)
        garment(leg,[(-.51,.101,.096,0),(-.35,.092,.096,0),(-.13,.121,.123,0),(0,.132,.13,0)],14,16)
        # Rounded leather boots, ankle cuff and sole.
        ellipsoid(leg,(0,.055,-.53),(.115,.174,.103),5,16,8)
        garment(leg,[(-.56,.127,.128,.015),(-.30,.112,.107,0),(-.27,.123,.117,0)],5,16)
        cube(leg,(0,.064,-.625),(.235,.35,.055),13,.035)
        for z in [-.42,-.34]:cube(leg,(0,.117,z),(.16,.035,.035),1,.009)
        arm=part(name+'_Arm'+label,body.obj,(side*.32,0,1.32-.95));arms.append(arm)
        garment(arm,[(.09,.025,.035,0),(.055,.092,.10,0),(-.025,.137,.139,0),(-.12,.137,.136,0),(-.27,.104,.11,0),(-.31,.11,.115,0)],outfit,16)
        forearm=part(name+'_Forearm'+label,arm.obj,(0,0,-.29))
        # Rounded elbow overlaps the sleeve; wrist, hand and equipment follow it.
        ellipsoid(forearm,(0,0,0),(.087,.083,.087),7,12,8)
        garment(forearm,[(0,.086,.083,0),(-.14,.075,.074,.009),(-.26,.066,.064,.013)],7,16)
        garment(forearm,[(-.10,.083,.084,.012),(-.21,.074,.075,.015)],5,16)
        ellipsoid(forearm,(0,.026,-.30),(.079,.075,.10),7,12,8)
        ellipsoid(forearm,(-side*.066,.051,-.276),(.035,.034,.05),7,10,6)
    sword=part(name+'_Sword',next(p.obj for p in PARTS if p.obj.name==name+'_ForearmR'),(0,.06,-.32))
    # Blade runs forward (+Y), matching the original sword pose.
    cube(sword,(0,.09,0),(.065,.23,.065),5,.015)
    cube(sword,(0,.22,0),(.34,.065,.08),9,.02)
    vs=[(-.057,.24,0),(0,.24,.035),(.057,.24,0),(0,.24,-.035),(-.045,.88,0),(0,.88,.026),(.045,.88,0),(0,.88,-.026),(0,1.06,0)]
    sword.add(vs,[(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0),(4,8,5),(5,8,6),(6,8,7),(7,8,4)],10)
    # Kite shield faces out from the left forearm, layered wood and forged rim.
    shield=part(name+'_Shield',next(p.obj for p in PARTS if p.obj.name==name+'_ForearmL'),(0,0,.29))
    for offset,tile,sc in [(0,10,1),(-.026,1,.87)]:
        points=[(-.115+offset,-.20,-.31),(-.115+offset,-.12,-.12),(-.115+offset,.14,-.12),(-.115+offset,.21,-.31),(-.115+offset,0,-.66)]
        center=Vector((-.115+offset,0,-.35));points=[center+(Vector(v)-center)*sc for v in points]
        shield.add(points,[(0,1,2,3,4)],tile)
    # Body pivots at the waist; legs remain rooted at the pelvis.
    body.v=[(x,y,z-.95) for x,y,z in body.v]
    if adult:
        root.obj.scale=(1.12,1.1,1.22)
    return root
hero('Hero_Child');hero('Hero_Adult',True)
hero('Rowan',True,'elder');hero('Mira',False,'mira');hero('Smith',True,'smith')

# A carved stone sentinel replaces the toy-like enemy silhouette.
p=model('Warden')
for side in [-1,1]:
    cube(p,(side*.3,0,.33),(.40,.56,.66),2,.10)
    cube(p,(side*.3,-.14,.13),(.44,.72,.24),10,.07)
    cube(p,(side*.70,0,1.03),(.35,.4,.83),2,.1,(0,side*.14,0))
    cube(p,(side*.6,0,1.53),(.58,.60,.42),11,.1)
garment(p,[(.70,.39,.25,0),(1.12,.43,.28,0),(1.60,.56,.29,0),(1.72,.33,.22,0)],2,12)
cube(p,(0,0,1.99),(.56,.51,.56),11,.11)
cube(p,(0,-.273,2.0),(.40,.05,.09),13,.01)
for x in [-.12,.12]:cube(p,(x,-.305,2.01),(.085,.025,.042),9,.005)
for side in [-1,1]:beam(p,(side*.21,-.31,1.47),(0,-.32,1.18),.06,.035,9,.01)

# Small curved modeled leaves replace the conspicuous image cards close to the player.
for name,count in [('Alder_Leaves',96),('Alder_Leaves_Far',28)]:
    p=model(name)
    for i in range(count):
        a=i*2.399; r=.22+.45*math.sqrt((i+.5)/count)
        pos=(math.cos(a)*r,math.sin(a)*r,math.sin(i*1.9)*.40)
        size=.21+random.random()*.10
        if count<50:size*=1.5
        vs=[(0,-size,0),(-size*.43,-size*.12,0),(0,size,-.025),(size*.43,-size*.12,0),(0,0,.04)]
        fs=[(0,1,4),(1,2,4),(2,3,4),(3,0,4)]
        p.add(vs,fs,14,trans(pos,(random.uniform(-.9,.9),random.uniform(-.8,.8),a)))

p=model('Cobble_Patch')
for row in range(7):
    for col in range(6):
        x=(col-2.5)*.48+(row%2)*.14
        cube(p,(x,(row-3)*.42,.022+random.uniform(-.015,.012)),(.44+random.uniform(-.03,.025),.385,.085),2 if (row+col)%4 else 11,.034,(0,0,random.uniform(-.05,.05)))

p=model('Caldera')
vs=[];fs=[];n=64
for j,(r,z) in enumerate([(1.0,23),(5.5,23),(7.5,27),(10,23),(15,16),(22,8),(29,0),(34,-1)]):
    for i in range(n):
        a=i*math.tau/n
        rr=r*(1+.06*math.sin(a*7)+.045*math.cos(a*11+j*.3))
        h=z+(1 if j<3 else 2)*math.sin(a*9+j*.2)+math.cos(a*17)*.5
        vs.append((math.cos(a)*rr,math.sin(a)*rr,h))
for j in range(7):
    for i in range(n):
        a=j*n+i;b=j*n+(i+1)%n
        fs.extend([(a,b,b+n),(a,b+n,a+n)])
p.add(vs,[tuple(reversed(f)) for f in fs],2)

# Terrain landmarks have actual depth and varied slopes instead of flat backdrop cards.
p=model('Mountain_Ridge')
vs=[];fs=[];n=38;rows=12
for j in range(rows+1):
    t=j/rows
    for i in range(n+1):
        x=(i/n-.5)*110
        ridge=24+11*math.sin(i*.34)+5*math.sin(i*.87)+3*math.sin(i*1.7)
        h=max(0,ridge*math.sin(t*math.pi)**1.7)
        y=(t-.5)*52+math.sin(i*.43)*3
        vs.append((x,y,h+math.sin(i*1.9+j*.7)*1.1))
for j in range(rows):
    for i in range(n):
        a=j*(n+1)+i;b=a+1;c=a+n+2;d=a+n+1
        fs.extend([(a,b,c),(a,c,d)])
p.add(vs,fs,2)

p=model('Cliff')
for i in range(7):
    x=(i-3)*1.5;y=math.sin(i*1.3)*.6;h=3.5+math.sin(i*2.7)*1.3
    profile=[(0,.92),(.3,1.0),(h*.63,.83),(h,.48),(h+.1,.1)]
    lathe(p,profile,2,7,(x,y,0),(0,.12*math.sin(i),.15*i))

p=model('Observatory')
lathe(p,[(0,3.2),(.4,3.2),(.6,2.8),(1.1,2.8),(1.25,2.3)],2,32)
lathe(p,[(1.2,1.45),(2.0,1.38),(3.0,.9),(4.0,.7),(4.3,1.5)],11,24)
for plane in range(3):
    for i in range(48):
        a=i*math.tau/48;b=(i+1)*math.tau/48
        def point(t):
            v=Vector((math.cos(t)*4.4,0,math.sin(t)*4.4))
            v=Matrix.Rotation(plane*.9,3,'Z')@v
            if plane==1:v=Matrix.Rotation(.7,3,'X')@v
            return (v.x,v.y,v.z+8.6)
        beam(p,point(a),point(b),.16,.22,9,.02)
lathe(p,[(4.0,.12),(12.9,.12)],9,12)
for i in range(8):
    a=i*math.tau/8
    lathe(p,[(0,.34),(.3,.4),(3.4,.28),(3.6,.45)],11,12,(math.cos(a)*5.3,math.sin(a)*5.3,0))

p=model('Dungeon_Wall')
cube(p,(0,0,4),(6,1.0,8),2,.035)
for row in range(12):
    for col in range(5):
        x=(col-2)*1.21+(row%2)*.18
        cube(p,(x,-.53,.34+row*.655),(1.17,.17,.61),11 if row in (0,11) else 2,.036)
for z in [.25,7.78]:cube(p,(0,-.59,z),(6.0,.32,.22),11,.04)

for p in PARTS:p.finish()
bpy.context.view_layer.update()
# Asset metadata and Blender library remain editable; glTF exports only assets.
manifest=[]
for root in ROOTS:
    meshes=[o for o in root.children_recursive if o.type=='MESH']
    tri=sum(sum(len(poly.vertices)-2 for poly in o.data.polygons) for o in meshes)
    manifest.append({'name':root.name,'triangles':tri,'meshParts':len(meshes)})
    root['asset_authoring']='Blender 4.5 / scripts/build_assets.py'
    root['forward']='-Z after glTF export (characters); +Z for building fronts'
    root['triangles']=tri
# Export together: texture images are embedded once and material slots shared.
bpy.ops.object.select_all(action='DESELECT')
for root in ROOTS:
    root.select_set(True)
    for o in root.children_recursive:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ART/'alder-kit.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_texcoords=True,export_normals=True,export_tangents=True,export_materials='EXPORT',export_extras=True,export_animations=False)
(OUT/'manifest.json').write_text(json.dumps({'assets':manifest,'totalTriangles':sum(m['triangles'] for m in manifest),'atlasResolution':N,'source':'art/blender/alder-library.blend'},indent=2))
# Arrange an editable contact sheet in the .blend after exporting asset origins.
for i,root in enumerate(ROOTS):root.location=((i%5)*18,(i//5)*20,0)
# Packed images and the startup file's browser panes otherwise record absolute local paths.
for img in bpy.data.images:
    for pf in img.packed_files:pf.filepath='//'+Path(pf.filepath).name
for screen in bpy.data.screens:
    for area in screen.areas:
        for space in area.spaces:
            if space.type=='FILE_BROWSER' and space.params:space.params.directory=b'//'
bpy.ops.wm.save_as_mainfile(filepath=str(ART/'alder-library.blend'))
print('ASSET_BUILD_COMPLETE',json.dumps(manifest))
