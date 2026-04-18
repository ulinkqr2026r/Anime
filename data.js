/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — data.js
   All static data: characters, expressions,
   poses, backgrounds, effects, templates
═══════════════════════════════════════════ */

const CHARS = [
  {id:'prash', name:'Prash',   emoji:'🧑', skin:'#f4a261', hair:'#1a1a2e', shirt:'#e63946'},
  {id:'sir',   name:'Sir',     emoji:'👨‍🏫', skin:'#f4a261', hair:'#2d2d2d', shirt:'#457b9d'},
  {id:'bro',   name:'Bro',     emoji:'😎', skin:'#f4a261', hair:'#000',    shirt:'#06d6a0'},
  {id:'dadi',  name:'Dadi',    emoji:'👵', skin:'#e8c5a0', hair:'#888',    shirt:'#8338ec'},
  {id:'boss',  name:'Boss',    emoji:'🤵', skin:'#f4a261', hair:'#111',    shirt:'#1a1a2e'},
  {id:'noob',  name:'Noob',    emoji:'🤓', skin:'#fad2af', hair:'#5c3d11', shirt:'#3a86ff'},
  {id:'gurl',  name:'Gurl',    emoji:'👩', skin:'#fad2af', hair:'#6f1d1b', shirt:'#ff006e'},
  {id:'alien', name:'Alien',   emoji:'👽', skin:'#80ffdb', hair:'#1a4a1a', shirt:'#40916c'},
];

const SKIN_TONES  = ['#fad2af','#f4a261','#e8c5a0','#d4876c','#a0522d','#6b3a2a','#80ffdb'];
const SHIRT_COLORS= ['#e63946','#457b9d','#06d6a0','#ff006e','#ffd600','#8338ec','#1a1a2e','#ff8c00','#00d4ff','#2d6a4f'];
const HAIR_COLORS = ['#1a1a2e','#2d2d2d','#5c3d11','#6f1d1b','#888','#c49a6c','#fff','#ff3c5a','#6a0dad'];

const EXPRESSIONS = [
  {id:'normal',   name:'Normal',   emoji:'😐'},
  {id:'angry',    name:'ANGRY',    emoji:'😡'},
  {id:'furious',  name:'FURIOUS',  emoji:'🤬'},
  {id:'crying',   name:'Crying',   emoji:'😢'},
  {id:'sobbing',  name:'Sobbing',  emoji:'😭'},
  {id:'happy',    name:'Happy',    emoji:'😄'},
  {id:'shocked',  name:'SHOCKED',  emoji:'😱'},
  {id:'smug',     name:'Smug',     emoji:'😏'},
  {id:'laugh',    name:'Haha',     emoji:'😂'},
  {id:'dead',     name:'💀 Dead',  emoji:'💀'},
  {id:'cool',     name:'Cool',     emoji:'😎'},
  {id:'confused', name:'Wut??',    emoji:'😕'},
  {id:'evil',     name:'Evil',     emoji:'😈'},
  {id:'nervous',  name:'Nervous',  emoji:'😰'},
  {id:'excited',  name:'Excited',  emoji:'🤩'},
  {id:'love',     name:'Love',     emoji:'😍'},
  {id:'fire',     name:'🔥 LIT',   emoji:'🔥'},
  {id:'sus',      name:'Sus',      emoji:'🫤'},
];

// Expression rendering parameters
const EXPR_MAP = {
  normal:   {ew:.075, eh:.075, brow:0,     mouth:'smile',    extras:[]},
  angry:    {ew:.07,  eh:.04,  brow:-.18,  mouth:'growl',    extras:['vein','flush']},
  furious:  {ew:.065, eh:.03,  brow:-.25,  mouth:'roar',     extras:['vein','flush','steam']},
  crying:   {ew:.07,  eh:.07,  brow:.12,   mouth:'sad',      extras:['tears']},
  sobbing:  {ew:.04,  eh:.07,  brow:.15,   mouth:'sad',      extras:['tears','bigcry']},
  happy:    {ew:.07,  eh:.07,  brow:0,     mouth:'bigsmile', extras:['rosy']},
  shocked:  {ew:.095, eh:.095, brow:.2,    mouth:'ohno',     extras:['sweat']},
  smug:     {ew:.055, eh:.03,  brow:-.08,  mouth:'smirk',    extras:[]},
  laugh:    {ew:.065, eh:.02,  brow:0,     mouth:'laugh',    extras:['rosy']},
  dead:     {ew:.07,  eh:.07,  brow:0,     mouth:'dead',     extras:['cross']},
  cool:     {ew:.07,  eh:.06,  brow:-.05,  mouth:'smirk',    extras:['shades']},
  confused: {ew:.075, eh:.06,  brow:.04,   mouth:'wavy',     extras:['sweat','question']},
  evil:     {ew:.055, eh:.04,  brow:-.2,   mouth:'evil',     extras:['glow']},
  nervous:  {ew:.075, eh:.075, brow:.08,   mouth:'nervous',  extras:['sweat']},
  excited:  {ew:.09,  eh:.09,  brow:-.05,  mouth:'bigsmile', extras:['rosy','sparkles']},
  love:     {ew:.085, eh:.09,  brow:0,     mouth:'smile',    extras:['hearts_eye']},
  fire:     {ew:.08,  eh:.08,  brow:-.12,  mouth:'bigsmile', extras:['fire_hair']},
  sus:      {ew:.045, eh:.025, brow:-.22,  mouth:'smirk',    extras:[]},
};

// Mouth shapes for lip sync
const MOUTH_SHAPES = [
  {id:'closed', name:'Closed', emoji:'😶'},
  {id:'small',  name:'Small',  emoji:'😮'},
  {id:'open',   name:'Open',   emoji:'😲'},
  {id:'wide',   name:'Wide',   emoji:'😱'},
  {id:'smile',  name:'Smile',  emoji:'😊'},
  {id:'ee',     name:'"EE"',   emoji:'😁'},
  {id:'oh',     name:'"OH"',   emoji:'😮'},
  {id:'mm',     name:'"MM"',   emoji:'😶'},
];

// Phoneme → mouth shape mapping for auto lip sync
const PHONEME_MAP = {
  'a': 'open',  'e': 'ee',   'i': 'ee',   'o': 'oh',  'u': 'oh',
  'p': 'mm',    'b': 'mm',   'm': 'mm',   'f': 'small','v': 'small',
  'l': 'open',  'r': 'open', 's': 'small','z': 'small','k': 'small',
  'g': 'small', 'd': 'small','t': 'small','n': 'small','h': 'open',
  'w': 'oh',    'y': 'ee',   'x': 'small','q': 'oh',  'j': 'small',
  ' ': 'closed','': 'closed',
};

const POSES = [
  {id:'stand',    name:'Stand',    emoji:'🧍'},
  {id:'arms',     name:'Arms Up',  emoji:'🙌'},
  {id:'point',    name:'Pointing', emoji:'👉'},
  {id:'facepalm', name:'Facepalm', emoji:'🤦'},
  {id:'jump',     name:'Jump',     emoji:'🦘'},
  {id:'bow',      name:'Bow',      emoji:'🙇'},
  {id:'run',      name:'Running',  emoji:'🏃'},
  {id:'sit',      name:'Sit',      emoji:'🪑'},
];

const BACKGROUNDS = [
  {id:'classroom', name:'Class 🏫'},
  {id:'street',    name:'Street 🏙'},
  {id:'home',      name:'Home 🏠'},
  {id:'epic',      name:'EPIC ⚡'},
  {id:'office',    name:'Office 💼'},
  {id:'sky',       name:'Sunset 🌅'},
  {id:'fire',      name:'Fire 🔥'},
  {id:'black',     name:'Dark 🌑'},
  {id:'manga',     name:'Manga 📖'},
  {id:'rooftop',   name:'Roof 🏯'},
  {id:'gym',       name:'Gym 🏋'},
  {id:'space',     name:'Space 🚀'},
];

const BG_COLORS = [
  '#1a237e','#1b3a20','#6b1a1a','#2a1a4a','#2d3748',
  '#5c2b00','#700a00','#050510','#e8e8e8','#2d1b69','#1a2a1a','#000015'
];

const EFFECTS = [
  {id:'speedlines', name:'💨 Speed Lines'},
  {id:'impact',     name:'💥 Impact Text'},
  {id:'sakura',     name:'🌸 Sakura'},
  {id:'sweat',      name:'💧 Sweat Drops'},
  {id:'stars',      name:'⭐ Stars'},
  {id:'smoke',      name:'💨 Smoke'},
  {id:'lightning',  name:'⚡ Lightning'},
  {id:'hearts',     name:'❤️ Hearts'},
  {id:'question',   name:'❓ ???'},
  {id:'money',      name:'💸 Money'},
  {id:'fire_fx',    name:'🔥 Fire Aura'},
  {id:'rainbow',    name:'🌈 Rainbow'},
];

const SOUND_TAGS = [
  {id:'pow',  name:'💥 POW!'},
  {id:'bam',  name:'🔴 BAM!'},
  {id:'nooo', name:'😱 NOOO!'},
  {id:'lol',  name:'😂 LOL!'},
  {id:'omg',  name:'😮 OMG!'},
  {id:'oof',  name:'😬 OOF!'},
];

const TEMPLATES = [
  {
    name:'Angry Prash Intro', icon:'😡', desc:'Classic angry rant – 8 frames',
    frames:[
      {chars:[{charId:'prash',exprId:'normal',pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'Aaj main tumhe ek baat bolunga...',bubbleType:'speech'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'angry', pose:'arms', charX:45,charY:58,charScale:1,flip:false,dialogue:'YE KYA NONSENSE HAI?!',bubbleType:'angry'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'furious',pose:'arms',charX:45,charY:58,charScale:1.1,flip:false,dialogue:'MAIN BAHUT GUSSA HOON!!',bubbleType:'shout'}],bgId:'epic',effects:['speedlines','lightning'],holdFrames:8},
      {chars:[{charId:'prash',exprId:'shocked',pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'',bubbleType:'none'}],bgId:'epic',effects:['impact'],holdFrames:4},
      {chars:[{charId:'prash',exprId:'angry', pose:'point',charX:45,charY:58,charScale:1,flip:false,dialogue:'Kuch bhi seekhte nahi aap log!',bubbleType:'speech'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'smug',  pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'Maine bola tha na...',bubbleType:'speech'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'laugh', pose:'arms', charX:45,charY:58,charScale:1,flip:false,dialogue:'Hahaha! Roasted!',bubbleType:'caption'}],bgId:'home',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'cool',  pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'Goodbye! 😎',bubbleType:'speech'}],bgId:'black',effects:[],holdFrames:6},
    ]
  },
  {
    name:'MJO Roast Format', icon:'😂', desc:'Make Joke Of template – 6 frames',
    frames:[
      {chars:[{charId:'sir', exprId:'smug',   pose:'stand',charX:35,charY:58,charScale:1,flip:false,dialogue:'Ohh toh aapne socha...',bubbleType:'speech'},{charId:'noob',exprId:'happy',pose:'stand',charX:65,charY:58,charScale:1,flip:true,dialogue:'',bubbleType:'none'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'sir', exprId:'smug',   pose:'stand',charX:35,charY:58,charScale:1,flip:false,dialogue:'',bubbleType:'none'},{charId:'noob',exprId:'happy',pose:'stand',charX:65,charY:58,charScale:1,flip:true,dialogue:'Haan main toh expert hoon!',bubbleType:'speech'}],bgId:'classroom',effects:[],holdFrames:6},
      {chars:[{charId:'sir', exprId:'laugh',  pose:'arms', charX:45,charY:58,charScale:1,flip:false,dialogue:'HAHAHA! 😂',bubbleType:'shout'}],bgId:'classroom',effects:['stars'],holdFrames:6},
      {chars:[{charId:'bro', exprId:'dead',   pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'Ye sun ke main mar gaya',bubbleType:'caption'}],bgId:'epic',effects:['impact'],holdFrames:6},
      {chars:[{charId:'dadi',exprId:'shocked',pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:'Beta ye kya tha?!',bubbleType:'speech'}],bgId:'home',effects:[],holdFrames:6},
      {chars:[{charId:'prash',exprId:'cool',  pose:'stand',charX:45,charY:58,charScale:1,flip:false,dialogue:"That's a Wrap! Follow karo!",bubbleType:'caption'}],bgId:'black',effects:[],holdFrames:6},
    ]
  },
  {
    name:'Walk-In Scene', icon:'🚶', desc:'Character walks across the scene',
    frames:[
      {chars:[{charId:'prash',exprId:'normal',pose:'run',charX:10,charY:62,charScale:1,flip:false,walkDir:'right',dialogue:'',bubbleType:'none'}],bgId:'street',effects:[],holdFrames:4},
      {chars:[{charId:'prash',exprId:'normal',pose:'run',charX:25,charY:62,charScale:1,flip:false,walkDir:'right',dialogue:'',bubbleType:'none'}],bgId:'street',effects:[],holdFrames:4},
      {chars:[{charId:'prash',exprId:'normal',pose:'run',charX:40,charY:62,charScale:1,flip:false,walkDir:'right',dialogue:'',bubbleType:'none'}],bgId:'street',effects:[],holdFrames:4},
      {chars:[{charId:'prash',exprId:'shocked',pose:'stand',charX:55,charY:62,charScale:1,flip:false,dialogue:'',bubbleType:'none'}],bgId:'street',effects:['sweat'],holdFrames:4},
      {chars:[{charId:'sir', exprId:'smug',pose:'point',charX:75,charY:58,charScale:1,flip:true,dialogue:'',bubbleType:'none'},{charId:'prash',exprId:'nervous',pose:'stand',charX:45,charY:62,charScale:.9,flip:false,dialogue:'Y-yaar...',bubbleType:'thought'}],bgId:'street',effects:[],holdFrames:8},
    ]
  },
];
