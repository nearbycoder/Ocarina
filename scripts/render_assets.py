import bpy, math, os
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'art/blender/alder-library.blend'))
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=1280;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.world.color=(.2,.2,.2)
scene.view_settings.view_transform='AgX'
for o in scene.objects:o.hide_render=True
roots=['Cottage_Slate','Hero_Child']
for name in roots:
    root=bpy.data.objects[name];root.location=(0,0,0)
# Lights and ground remain separate from source assets.
bpy.ops.mesh.primitive_plane_add(size=200)
floor=bpy.context.object;floor.name='Studio floor'
m=bpy.data.materials.new('Studio floor');m.diffuse_color=(.18,.20,.18,1);floor.data.materials.append(m)
def area(name,pos,power,size):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
area('Large key',(4,-7,12),1800,7);area('Cool fill',(-6,-1,6),850,6);area('Rim',(3,5,8),1400,5)
bpy.ops.object.camera_add();cam=bpy.context.object;scene.camera=cam
for name,pos,target,ortho in [('Cottage_Slate',(11,-15,10),(0,0,3.4),12),('Hero_Child',(2.5,5,2.4),(0,0,1.03),2.65)]:
    for n in roots:
        for o in [bpy.data.objects[n],*bpy.data.objects[n].children_recursive]:o.hide_render=n!=name
    cam.location=pos;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=ortho
    scene.render.filepath=str(ROOT/'docs/artifacts'/('blender-'+name+'.png'))
    bpy.ops.render.render(write_still=True)
