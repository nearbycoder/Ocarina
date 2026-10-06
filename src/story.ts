import type { SaveData } from "./data";

export interface StoryState {
  prologue: number;
  promise: "home" | "remember" | null;
  reunited: boolean;
  seen: string[];
  pending: { id: string; page: number } | null;
}
export interface StoryPage {
  speaker: string;
  text: string;
}
export interface StoryScene {
  chapter: string;
  title: string;
  pages: StoryPage[];
  choice?: boolean;
}
const page = (speaker: string, text: string): StoryPage => ({ speaker, text });
export const SCENES: Record<string, StoryScene> = {
  opening: {
    chapter: "PROLOGUE · THE LANTERN MORNING",
    title: "Before the world grew quiet",
    pages: [
      page(
        "ALDER VILLAGE · YOUR ELEVENTH SUMMER",
        "Your father always hung the first lantern. This year, his hook beside the door is empty. Tomas left to mend the great bell last autumn. His last letter said he would be home before the apples ripened.",
      ),
      page(
        "MIRA · CALLING FROM THE WELL",
        "Alder! You promised you’d help with the lanterns. Rowan says we’re lighting them even if the bell won’t ring. Come on. I saved you the one with the crooked handle.",
      ),
      page(
        "A MORNING THAT STILL BELONGS TO YOU",
        "You put your father’s reed flute in your satchel and step outside. Find Mira by the well. Move with {move}; {look} to look around. Walk close and {talk} to talk.",
      ),
    ],
  },
  lantern: {
    chapter: "PROLOGUE · THE LANTERN MORNING",
    title: "One small errand",
    pages: [
      page(
        "MIRA",
        "Don’t laugh. I opened the lantern to feed them and all three lights escaped. One’s by the apple trees, just east of here. Will you get that one? We can find the others later.",
      ),
      page(
        "ALDER",
        "If I bring it back, you have to stop saying my dad’s flute sounds like a wet goose.",
      ),
      page(
        "MIRA",
        "Make it sound less like a wet goose, then. Go on — the orchard’s just past Soren’s house. Press E near the little golden light.",
      ),
    ],
  },
  silence: {
    chapter: "CHAPTER I · THE NOTE THAT BROKE",
    title: "A bell without an echo",
    pages: [
      page(
        "MIRA",
        "You found it! Here, hold the handle. Tonight we’ll hang it on your father’s hook. He’ll see it from the road.",
      ),
      page(
        "THE BELL SANCTUARY",
        "A single note rolls over the roofs. The light in your hands folds into a tiny, frightened spark. No bird answers. Far north, the dark tower gives the same note back.",
      ),
      page(
        "MIRA",
        "Alder… your flute. It’s warm. That’s your dad’s tune, isn’t it? Go to Soren. He was with your father the night he left. I’ll stay with the light.",
      ),
    ],
  },
  smith: {
    chapter: "CHAPTER I · THE NOTE THAT BROKE",
    title: "Something worth carrying",
    pages: [
      page(
        "SOREN",
        "I made Tomas a new bell pin before he left. He made me promise to look after you. Neither of us thought it would come to this.",
      ),
      page(
        "SOREN",
        "Take this practice blade and the oak shield. {Sword} to strike. {Shield} to block, then answer while a guardian recovers. {Dodge} to roll out of reach. You needn’t win every fight. Coming home counts.",
      ),
      page(
        "SOREN",
        "Rowan knows why the bell rang. Ask him properly this time. And don’t let him tell you you’re too young to hear the answer.",
      ),
    ],
  },
  commission: {
    chapter: "CHAPTER I · THE NOTE THAT BROKE",
    title: "The keeper’s son",
    pages: [
      page(
        "ROWAN",
        "I kept your father’s last message from you. I thought waiting would be kinder. I was wrong. He went to stop the king’s stilling bell — a bell that takes tomorrow away, one village at a time.",
      ),
      page(
        "ROWAN",
        "Tomas hid three living notes in the old sanctuaries: a seed in Whisperwood, an ember in Cinderpeak, a pearl by Larkwater. Their guardians have gone silent. Your flute can wake what they protected.",
      ),
      page(
        "ALDER",
        "Then I’ll find the notes. And I’ll find out what happened to him. You don’t get to decide what I can bear anymore.",
      ),
      page(
        "ROWAN",
        "Start with the Rootbound Hollow, west along the pale road. The other two can wait until you’re ready; you may seek them in any order. M opens your map. Your journal will keep what you learn.",
      ),
    ],
  },
  root: {
    chapter: "CHAPTER II · WHAT OUR PARENTS LEAVE",
    title: "The tree remembers",
    pages: [
      page(
        "A MEMORY HELD IN THE SEED",
        "Your father kneels beside a wounded guardian. He sets down his hammer. ‘You were made to shelter things,’ he says. ‘You can remember how.’ Beneath the stone mask, a green shoot opens.",
      ),
      page(
        "TOMAS · AN OLD RECORDING",
        "Alder, if you find this: courage isn’t being the only one who can do a thing. It’s asking someone to stand beside you. These notes open the way to Crownfall. Keep them out of the king’s hands.",
      ),
      page(
        "ALDER",
        "The seed is warm. For the first time since autumn, you can remember your father’s voice without trying. You write his words down before they fade.",
      ),
    ],
  },
  ember: {
    chapter: "CHAPTER II · WHAT OUR PARENTS LEAVE",
    title: "The king had a name",
    pages: [
      page(
        "A MEMORY HELD IN THE EMBER",
        "The furnace shows a king without his crown, hammering a bell until his hands bleed. Beside him lies a small shoe, still wet with river mud. A name is scratched into its sole: Ilen.",
      ),
      page(
        "THE ROYAL FOUNDER",
        "King Oras asked us for one more day with his daughter. We could not return the dead. So he ordered a bell that would never allow another day to end. We built it. That was our shame.",
      ),
      page(
        "ALDER",
        "The silence isn’t an army coming to conquer the kingdom. It is one person’s grief, made large enough to swallow everyone else. You close your hand around the ember. It still burns.",
      ),
    ],
  },
  tide: {
    chapter: "CHAPTER II · WHAT OUR PARENTS LEAVE",
    title: "The last letter",
    pages: [
      page(
        "TOMAS · THE PEARL’S MEMORY",
        "I’ve broken the king’s first bell. The floodgate is closing, and someone has to hold the wheel while the coast gets out. I won’t be coming through it.",
      ),
      page(
        "TOMAS",
        "I wanted to teach you everything. How to plane a door. How to mend that crooked lantern. I’m sorry about the things we won’t do. None of this is a debt you owe me, Alder. Live a life of your own.",
      ),
      page(
        "ALDER",
        "You sit beside the water until your hands stop shaking. There is no rescue waiting at the end of this road. But there are people at home who still need tomorrow. You put the pearl beside the flute.",
      ),
    ],
  },
  farewell: {
    chapter: "CHAPTER III · THE YEARS BETWEEN",
    title: "What will you carry?",
    choice: true,
    pages: [
      page(
        "ROWAN · AT THE BELL",
        "The three notes have opened the crossing. Crownfall is seven years ahead of us, sealed inside the king’s stolen time. The bell can take you there. Your body will grow through those years; you will not get to live them.",
      ),
      page(
        "MIRA",
        "Seven birthdays? All at once? …Then I’ll be older than you when you get back. Don’t argue. I’ll have actually done them.",
      ),
      page(
        "ALDER",
        "I thought I was doing this to bring Dad home. Now I think I’m doing it so nobody else has to wait beside an empty hook.",
      ),
      page(
        "MIRA",
        "I’m frightened too. I’ll keep the village going. You keep one thing for me — something the bell can’t take. What do you promise?",
      ),
    ],
  },
  crossing: {
    chapter: "CHAPTER IV · SEVEN WINTERS",
    title: "The world did not wait",
    pages: [
      page(
        "THE FIRST WINTER",
        "Mira hangs your lantern beside the well. Soren sets a second place at supper. Rowan writes your name in the village book and leaves the date of your return blank.",
      ),
      page(
        "THE FOURTH WINTER",
        "The north road freezes. Families from the coast sleep in Soren’s workshop. Mira stops waiting by the sanctuary every morning. There is bread to make, and someone has to make it.",
      ),
      page(
        "THE SEVENTH SPRING",
        "The bell releases a breath. Your sleeves stop halfway along your arms. In the polished stone, a stranger has your eyes. Below the hill, a lantern is still burning. Go home. Find Mira by the well.",
      ),
    ],
  },
  reunion: {
    chapter: "CHAPTER IV · SEVEN WINTERS",
    title: "You’re late",
    pages: [
      page(
        "MIRA",
        "…Alder? Hold still. Let me look at you. I had a speech ready. Seven years to write it, and all I can think is that your hair’s still a disaster.",
      ),
      page(
        "ALDER",
        "For me, we were just at the bell. I’m sorry. I don’t know how to be the person you’ve been waiting for.",
      ),
      page(
        "MIRA",
        "Then be the one who’s here. I kept your promise where I could see it. I got angry with you sometimes. I grew up. Both things can be true.",
      ),
      page(
        "MIRA",
        "We learned why the king couldn’t finish the silence. Your father scattered its answers: Clarity in Frostveil, Light in the Saffron Wastes, Mercy in Mourning Fen. I marked the old places on your map. This time, you’re carrying our work too.",
      ),
    ],
  },
  frost: {
    chapter: "CHAPTER V · THE THINGS WE KEEP",
    title: "A name beneath the frost",
    pages: [
      page(
        "THE MONASTERY’S WITNESS",
        "Oras struck his own name from every stone. ‘A king cannot grieve,’ he told us. ‘Let there be only the Crown.’ Yet every winter he returned to ask whether we remembered Ilen.",
      ),
      page(
        "ALDER",
        "Clarity is not forgetting what hurts. You speak both their names into the cold: Oras. Ilen. The mirror clears. There is a person beneath the Crown, and he can still be reached.",
      ),
    ],
  },
  sun: {
    chapter: "CHAPTER V · THE THINGS WE KEEP",
    title: "A sky that keeps moving",
    pages: [
      page(
        "THE ASTRONOMER’S RECORD",
        "The king commanded us to erase the hour of the flood. But the stars would not lie. Turn back one hour and every life begun after it is unwritten. Every friendship. Every child.",
      ),
      page(
        "ALDER",
        "You think of Mira making bread, of strangers sleeping safely in the forge. Bringing back yesterday would take those days from them. The light settles in your palm. You will open tomorrow, not undo it.",
      ),
    ],
  },
  moon: {
    chapter: "CHAPTER V · THE THINGS WE KEEP",
    title: "The song Ilen knew",
    pages: [
      page(
        "ILEN · A MEMORY IN THE MOONWELL",
        "A child sits beside the king at a reed-lined pool. He cannot play the flute, so she shows him: low, middle, high, middle, low. She laughs when he gets it wrong. He tries again.",
      ),
      page(
        "ALDER",
        "Your father taught you the same five notes. It was never a spell for stopping time. It was a song people gave their children. You write it in your journal: 1 · 2 · 3 · 2 · 1. At Crownfall, you will give it back.",
      ),
    ],
  },
  crownArrival: {
    chapter: "CHAPTER VI · LET THE MORNING COME",
    title: "The man inside the silence",
    pages: [
      page(
        "THE KING WITHOUT A NAME",
        "I know what you have lost. I could give you the morning before he left. His hand on your shoulder. The door still open. Would you truly throw that away?",
      ),
      page(
        "ALDER",
        "I would want it. Every day, I would want it. But my father stayed at that gate so other people could live. I won’t take their lives away to get mine back.",
      ),
      page(
        "THE SILENT CROWN",
        "The armor closes around the king. His bell drowns out your words. Open the seals, break the armor’s hold, and carry Ilen’s song to the chamber beyond: low, middle, high, middle, low.",
      ),
    ],
  },
  crown: {
    chapter: "EPILOGUE · AN ORDINARY MORNING",
    title: "A place at the table",
    pages: [
      page(
        "ORAS",
        "The broken armor falls quiet. You play the five notes again. ‘She always laughed at the last one,’ Oras says. This time, he lets the note end. The stilling bell cracks. Outside, the sun moves.",
      ),
      page(
        "ALDER VILLAGE",
        "You come home by the long road. Soren pretends he has something in his eye. Rowan closes the village book. Mira gives you a crooked lantern and makes you hang it yourself.",
      ),
      page(
        "MIRA",
        "There. Not straight, but it’ll hold. Come inside, Alder. The bread’s getting cold.",
      ),
    ],
  },
};

export function newStory(): StoryState {
  return {
    prologue: 0,
    promise: null,
    reunited: false,
    seen: [],
    pending: null,
  };
}
export function finishScene(s: SaveData, id: string) {
  if (!s.story.seen.includes(id)) s.story.seen.push(id);
  const steps: Record<string, number> = {
    opening: 1,
    lantern: 2,
    silence: 3,
    smith: 4,
    commission: 5,
  };
  s.story.prologue = Math.max(s.story.prologue, steps[id] || 0);
  if (id === "commission") s.talked = true;
  if (id === "reunion") s.story.reunited = true;
  s.story.pending = null;
}
export function storyObjective(
  s: SaveData,
): { title: string; detail: string } | null {
  if (s.won) return null;
  if (s.age === "adult" && !s.story.reunited)
    return {
      title: "You’re late",
      detail: "Return to Alder Village. Find Mira beside the well.",
    };
  if (s.age !== "child") return null;
  const objectives = [
    ["The lantern morning", "Your story begins outside your home."],
    [
      "A familiar face",
      "Find Mira by the well · {moveShort} to move, {use} to talk.",
    ],
    [
      "One small errand",
      s.fireflies.includes("orchard")
        ? "Bring the wandering light back to Mira by the well."
        : "Find the golden light in the orchard, east of the village. {Use} to catch it.",
    ],
    ["Someone who knows", "Speak with Soren at the forge, east of the well."],
    ["No more secrets", "Ask Elder Rowan, beside the well, about your father."],
  ];
  const q = objectives[s.story.prologue];
  return q ? { title: q[0], detail: q[1] } : null;
}
export function storyGate(s: SaveData): string | null {
  if (s.age === "child" && s.story.prologue < 5)
    return storyObjective(s)!.detail;
  if (s.age === "adult" && !s.story.reunited)
    return "Go home first. Mira is waiting beside the village well.";
  return null;
}
// One carving waits in each sanctuary's hidden alcove. Readable in any order:
// the childhood ones never say what the Tidal Archive reveals, and none names
// the king or his daughter. Tomas hid the notes and their answers in six of
// these places (Rowan and Mira say so); nothing says he reached the Crown.
export interface Carving {
  title: string;
  /** Who left it, as the dialogue heading shows it. */
  by: string;
  text: string;
}
export const CARVINGS: Record<string, Carving> = {
  root: {
    title: "Roots that hum",
    by: "A KEEPER’S MARK · THE ROOTBOUND HOLLOW",
    text: "A bell no bigger than your thumb is scratched into the stone, the way your father marked every door he ever mended. Beneath it: ‘Third night out. The roots in here hum when it rains. Alder would have climbed every one of them by now. — T.’",
  },
  ember: {
    title: "Soren’s pin",
    by: "A KEEPER’S MARK · THE EMBER VAULT",
    text: "‘Soren’s new pin holds. The heat in these walls smells like his forge, where Alder used to fall asleep on the bench waiting for me to finish. I would give a great deal for one more of those evenings. — T.’",
  },
  tide: {
    title: "Counting waves",
    by: "A KEEPER’S MARK · THE TIDAL ARCHIVE",
    text: "‘The tide comes up to the third step and no further. I sat and counted waves for an hour, just to hear something keep its rhythm. Alder plays the flute like this sea: loud, then sudden, then very gentle. — T.’",
  },
  frost: {
    title: "A list instead of a letter",
    by: "A KEEPER’S MARK · THE GLASS MONASTERY",
    text: "Frost fills an older inscription, but one line is fresh, cut by a steady hand: ‘Too cold for ink, so I carve. I keep meaning to write Alder a proper letter and keep writing lists instead. Mend the lantern handle. Plane the sticking door. Tell him. — T.’",
  },
  sun: {
    title: "One clock, wound",
    by: "A KEEPER’S MARK · THE SUNKEN OBSERVATORY",
    text: "‘Every clock in this place stopped at a different hour. I wound one, just to watch it go. Whatever comes of this, let the world keep its ordinary mornings: bread, chores, a boy late for supper. — T.’",
  },
  moon: {
    title: "Names over the dead",
    by: "A KEEPER’S MARK · THE MOONWELL CRYPT",
    text: "‘Every tomb here has a name cut over it. Someone cared enough to remember each one. If I am remembered, let it be as a man who mended doors and burned the porridge, not as the keeper of anything. — T.’",
  },
  crown: {
    title: "Five small dots",
    by: "MARKS IN THE PLASTER · THE SILENT CROWN",
    text: "No keeper’s bell is carved here. Low on the wall, a child has pressed five dots into the soft plaster, low to high and back again, and beside them drawn a crooked man trying to play a flute. They were never meant for you. You leave them as you found them.",
  },
};
export function journalEntries(s: SaveData) {
  return s.story.seen
    .filter((id) => SCENES[id])
    .map((id) => ({
      title: SCENES[id].title,
      pages: SCENES[id].pages.map((p, index) => ({
        ...p,
        text: storyPageText(SCENES[id], index, s.story.promise),
      })),
    }));
}

export function storyPageText(
  scene: StoryScene,
  index: number,
  promise: StoryState["promise"],
) {
  if (scene === SCENES.reunion && index === 2)
    return promise === "remember"
      ? "You promised to remember us. I wrote down everything you missed. Bad harvests. Good weddings. The day I finally fixed that lantern. You can read it when you’re ready. First, sit with me a moment."
      : "You promised you’d come home. I stopped pretending that meant everything would stay the same. I got angry with you sometimes. I grew up. Both things can be true. But there’s still a place for you here.";
  return scene.pages[index].text;
}

export function storyTarget(
  s: SaveData,
): { x: number; z: number; name: string } | null {
  if (s.won) return null;
  if (s.age === "adult")
    return s.story.reunited ? null : { x: -5, z: 57, name: "Mira" };
  switch (s.story.prologue) {
    case 1:
      return { x: -5, z: 57, name: "Mira" };
    case 2:
      return s.fireflies.includes("orchard")
        ? { x: -5, z: 57, name: "Mira" }
        : { x: 20, z: 66, name: "Orchard light" };
    case 3:
      return { x: 10, z: 54, name: "Soren" };
    case 4:
      return { x: 3.1, z: 49, name: "Rowan" };
    default:
      return null;
  }
}

export function npcReflection(
  s: SaveData,
  id: "elder" | "mira" | "smith",
): string | null {
  if (s.won)
    return {
      elder:
        "For seven years I left a space beside your name. This morning I wrote: came home. I think that is enough for the history books.",
      mira:
        s.story.promise === "remember"
          ? "I meant what I said. The book is yours to read. But tomorrow, we start a page neither of us has seen."
          : "You kept your promise. Tomorrow we can argue about whose turn it is to mend the fence. I’ve missed having ordinary things to argue about.",
      smith:
        "Your father never could hang a lantern straight. You’ve inherited his talent. Come by tomorrow. I’ll show you how to fix the bracket.",
    }[id];
  if (s.age === "adult")
    return {
      elder:
        "Mira kept the village fed. Soren sheltered the coast folk. I kept the records. You missed seven years, Alder. You didn’t miss being loved. Seek the three echoes when you’re ready.",
      mira: s.completed.includes("moon")
        ? "Low, middle, high, middle, low. You used to play it until everyone begged you to stop. Perhaps that’s why the king should be afraid of you. Come back, Alder."
        : "There’s bread here whenever you need it. I’m still finding your wandering lights too. Some things are allowed to take their time.",
      smith:
        "I kept his tools. It seemed wrong to let them rust. When this is over, you can decide what you want to make with them.",
    }[id];
  if (s.completed.includes("tide"))
    return {
      elder:
        "I am sorry, Alder. I should have trusted you with what I feared. Your father chose those people at the floodgate. What you do next is your choice, not his command.",
      mira: "You don’t have to tell me yet. We can just sit here. I remember the way your dad whistled through his teeth. You were terrible at it. We can remember the good bits too.",
      smith:
        "Tomas held the gate? Of course he did. He always said a thing wasn’t mended until everyone could use it. I wish, just once, he’d been a little less stubborn.",
    }[id];
  if (s.completed.includes("ember") && id === "elder")
    return "Oras. I had almost forgotten his name. Losing Ilen broke him; it did not give him the right to break everyone else. Remember that when you meet him.";
  if (s.completed.includes("root") && id === "mira")
    return "You heard him? His real voice? Tell me exactly what he said. I’ll write it down too. Then there’ll be two of us keeping it safe.";
  return null;
}
