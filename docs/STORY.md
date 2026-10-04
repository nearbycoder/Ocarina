# The Bell of Ages — narrative implementation

Contains campaign spoilers. This is an original coming-of-age story for the compact playable campaign, not a recreation of any existing game's characters or plot.

## Dramatic premise

Alder is eleven. His father Tomas, a bell keeper, has been missing since autumn. At the village lantern festival, Alder and his friend Mira intend to leave a light to guide him home. The great bell's first warning turns an ordinary morning into a journey to discover what happened to Tomas.

King Oras lost his daughter Ilen in a flood. He commissioned a bell that prevents tomorrow from arriving, hoping no one would ever have to lose another person. Tomas broke its first mechanism and scattered three living notes. Alder begins by hoping to rescue his father; he eventually chooses to protect the lives his father saved.

The central theme is growing into a future you cannot recover by returning to the past. The antagonist and protagonist both grieve. Their different responses drive the conflict.

## Playable progression

| Beat | Player action | Dramatic purpose |
| --- | --- | --- |
| Lantern morning | Leave home; find Mira | Establish home, a friendship, and the missing father before danger |
| One small errand | Collect the orchard light; return it to Mira | Teach movement and interaction through an ordinary shared task |
| The first warning | Visit Soren for equipment, then question Rowan | Introduce danger, combat controls, and an adult who has withheld the truth |
| Rootbound Hollow | Recover the Seed of Courage | Hear Tomas's voice and discover his belief in asking for help |
| Ember Vault | Recover the Ember of Resolve | Learn Oras's name and why he built the stilling bell |
| Tidal Archive | Recover the Pearl of Memory | Discover Tomas died holding the floodgate so others could escape |
| The crossing | Bring all three notes to the bell; choose a promise | Know the seven-year cost before choosing to leave childhood |
| Seven winters | Read three brief passages; return to Mira | Acknowledge the lives and labor of the people who stayed behind |
| Reunion | Talk to Mira before entering adult sanctuaries | Rebuild the relationship; make home matter after the time jump |
| Glass Monastery | Recover Clarity | See the person beneath the king's title |
| Sunken Observatory | Recover Light | Understand that undoing the past would erase other people's lives |
| Moonwell Crypt | Recover Mercy | Discover Ilen's five-note song, already familiar from Alder's father |
| Silent Crown | Refuse Oras's offer; solve the musical seal and defeat the warden | Choose a shared future over a private return to the past |
| An ordinary morning | Return home for supper | Resolve the personal promise with an ordinary life worth living |

The childhood temples remain available in any order after the prologue; the adult temples remain available in any order after the reunion. Dialogue uses independent discoveries so those orders remain coherent. Rowan, Mira, and Soren respond to discoveries when revisited. The lantern errand uses the existing orchard firefly, retaining progress toward Mira's optional three-light reward.

## The promise

At the crossing, “I'll find my way home” or “I'll remember us as we are” changes Mira's reunion dialogue, the journal's remembered conversation, and the ending. It is an emotional choice, not a branch into separate campaigns. Escape can advance ordinary lines but cannot choose a promise. The crossing explicitly states that either promise proceeds into adulthood.

## Implementation

- `src/story.ts` contains 16 scenes, quest stages, dialogue variants, map destinations, and discovered memories.
- New games begin outside Alder's home. Scripted dialogue uses establishing shots and pauses gameplay. Characters are existing Blender models; scenes currently use text, not voice acting or acted cinematics.
- The journal records only completed scenes, with complete conversations and the selected promise. Existing notes never reveal future scenes.
- Save data retains version 1 and adds a validated `story` object: prologue stage, promise, reunion status, seen scenes, and pending scene/line. Every dialogue advance saves. Reloading resumes the exact pending line.
- Saves created before the story addition retain equipment, relics, position, currency, and age. They skip the new prologue; adult saves also skip the reunion gate. Starting a new journey plays the complete opening.
- Cutscenes reuse the existing scene and renderer. Quest updates use the cached HUD; conversations and journal HTML are created only when opened. No new textures, geometry library, dependencies, or rendering passes are introduced.

## Production work still ahead

The story now connects the playable prototype from beginning to ending. It does not add a full-length campaign. Larger regional quests, playable flashbacks, distinct dungeon characters, staged NPC animation, voice work, authored music, additional adult character models, and deeper consequences in the environment remain future production work. Mira currently uses a taller version of the existing model in adulthood. The seven dungeons still use their existing compact trial layouts.
