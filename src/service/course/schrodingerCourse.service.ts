import mongoose from "mongoose";
import {
    ASSET_TYPES,
    DIFFICULTY_LEVELS,
    LANGUAGES_SUPPORTED,
    QUESTION_TYPES,
} from "../../constants/course.constants";
import { uploadCourseImageToS3 } from "../../helpers/s3Helper";
import Chapter from "../../models/course/chapter.model";
import Course from "../../models/course/course.model";
import Subject from "../../models/course/subject.model";
import Topic from "../../models/course/topic.model";

const SUBJECT_NAME = "Physics";
const COURSE_TITLE = "Schrodinger Equation";

const createInfoCardSvg = (title: string, subtitle: string, lines: string[]) => {
    const escapeXml = (value: string) =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

    const lineElements = lines
        .map(
            (line, index) =>
                `<text x="64" y="${216 + index * 48}" font-size="28" fill="#18324A" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
        )
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="720" viewBox="0 0 1200 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="720" rx="36" fill="#F6FAFF"/>
  <rect x="40" y="40" width="1120" height="640" rx="28" fill="#FFFFFF" stroke="#CFE0F4" stroke-width="4"/>
  <rect x="64" y="64" width="1072" height="108" rx="24" fill="#E9F3FF"/>
  <text x="64" y="118" font-size="42" font-weight="700" fill="#10213A" font-family="Arial, sans-serif">${escapeXml(title)}</text>
  <text x="64" y="158" font-size="24" fill="#3D5A73" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
  <rect x="64" y="196" width="1072" height="352" rx="24" fill="#FAFCFF" stroke="#D8E6F7" stroke-width="3"/>
  ${lineElements}
  <text x="64" y="622" font-size="22" fill="#5C7187" font-family="Arial, sans-serif">KickBi temporary course asset</text>
</svg>`;
};

const schrodingerCourseScript = {
    Course: {
        Title: COURSE_TITLE,
        Description:
            "A simple, student-friendly course that explains what the Schrodinger equation means and how students should think about it.",
        AIExplanations: [
            {
                English:
                    "Think of the Schrodinger equation as the rule book for quantum particles. It does not tell us a neat path like a cricket ball. It tells us how the wavefunction changes, and the wavefunction helps us predict where the particle may be found.",
                Hinglish:
                    "Schrodinger equation ko quantum particles ka rule book samjho. Yeh cricket ball jaisa clear path nahi batata. Yeh batata hai ki wavefunction kaise change hota hai, aur wavefunction se hum predict karte hain ki particle kahan mil sakta hai.",
            },
            {
                English:
                    "This course is for students who feel the topic is scary because of symbols. We will keep the idea simple: first understand the wavefunction, then probability, then energy, and only after that the equation starts making sense.",
                Hinglish:
                    "Yeh course un students ke liye hai jinko symbols dekhkar topic scary lagta hai. Hum idea simple rakhenge: pehle wavefunction samjho, phir probability, phir energy, aur uske baad equation sense banane lagti hai.",
            },
            {
                English:
                    "The equation connects the state of a quantum system with its energy. In plain words, if we know the energy situation around a particle, the equation tells us what wavefunction shapes are possible.",
                Hinglish:
                    "Yeh equation quantum system ki state ko uski energy se connect karti hai. Simple words mein, agar hume particle ke around energy situation pata hai, to equation batati hai ki kaun se wavefunction shapes possible hain.",
            },
            {
                English:
                    "A common mistake is to ask where exactly the electron is moving at every second. In quantum mechanics, the better question is: what does the wavefunction allow, and what are the chances of each result?",
                Hinglish:
                    "Common mistake yeh hai ki hum poochte hain electron har second exactly kahan move kar raha hai. Quantum mechanics mein better question yeh hai: wavefunction kya allow karta hai, aur har result ki chance kitni hai?",
            },
            {
                English:
                    "By the end of this course, the equation should feel less like a formula to memorize and more like a tool. It helps us understand allowed energies, standing waves, probability density, and tunneling.",
                Hinglish:
                    "Course ke end tak yeh equation ratne wali formula jaisi nahi, balki ek tool jaisi feel honi chahiye. Yeh allowed energies, standing waves, probability density, aur tunneling samajhne mein help karti hai.",
            },
        ],
        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
        LanguageSupported: LANGUAGES_SUPPORTED.ENGLISH,
        Tags: [
            "Physics",
            "Quantum Mechanics",
            "Schrodinger Equation",
            "Wavefunction",
            "Probability",
        ],
        IsPublished: true,
    },
    ThumbnailAsset: {
        FileName: "course-overview.svg",
        Svg: createInfoCardSvg(
            "Schrodinger Equation",
            "A gentle path through quantum wavefunctions",
            [
                "The equation describes the wavefunction.",
                "The wavefunction helps us calculate probability.",
                "Allowed wave shapes create allowed energies.",
                "Simple examples make the idea less confusing.",
            ]
        ),
    },
    Chapters: [
        {
            Title: "Building the Idea",
            Description:
                "This chapter explains why students need the Schrodinger equation before they start solving it.",
            AIExplanations: [
                {
                    English:
                        "In this chapter, we slow down and ask why the Schrodinger equation is needed at all. The goal is to make the equation feel natural, not sudden.",
                    Hinglish:
                        "Is chapter mein hum slow chalenge aur samjhenge ki Schrodinger equation ki need kyun hai. Goal yeh hai ki equation natural lage, achanak se aayi hui nahi.",
                },
                {
                    English:
                        "Students often get confused because they meet the equation before they meet the problem. Here we first look at the problem: tiny particles behave differently from everyday objects.",
                    Hinglish:
                        "Students confuse isliye hote hain kyunki equation pehle aa jati hai aur problem baad mein samajh aati hai. Yahan hum pehle problem dekhenge: tiny particles everyday objects se differently behave karte hain.",
                },
                {
                    English:
                        "The chapter introduces wave-like behavior, probability, and the wavefunction. These ideas are the foundation for reading the equation correctly.",
                    Hinglish:
                        "Yeh chapter wave-like behavior, probability, aur wavefunction introduce karta hai. Equation ko sahi tarah read karne ke liye yeh ideas foundation hain.",
                },
                {
                    English:
                        "The main shift is from exact path thinking to probability thinking. Once that shift happens, the Schrodinger equation becomes much easier to accept.",
                    Hinglish:
                        "Main shift exact path thinking se probability thinking ki taraf hai. Jab yeh shift ho jata hai, Schrodinger equation ko accept karna kaafi easy ho jata hai.",
                },
                {
                    English:
                        "Use this chapter as your intuition base. If later formulas feel confusing, come back here and remember that quantum mechanics starts with a different way of describing nature.",
                    Hinglish:
                        "Is chapter ko intuition base ki tarah use karo. Agar baad mein formulas confusing lagen, to yahan wapas aakar yaad karo ki quantum mechanics nature ko describe karne ka different way hai.",
                },
            ],
            Topics: [
                        {
                            Title: "Why We Need a Quantum Equation",
                            Description:
                                "A gentle introduction to why electrons and atoms need a wave-based equation.",
                            DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                            Keywords: ["classical physics", "quantum", "electron", "wave behavior"],
                            AIExplanations: [
                                {
                                    English:
                                        "This topic explains the reason behind the Schrodinger equation. We need it because tiny particles do not always behave like small versions of everyday objects.",
                                    Hinglish:
                                        "Yeh topic Schrodinger equation ke reason ko explain karta hai. Hume yeh equation chahiye kyunki tiny particles everyday objects ke small version jaise behave nahi karte.",
                                },
                                {
                                    English:
                                        "If an electron can show wave-like behavior, then we need a rule that can describe that wave-like behavior. That rule is the Schrodinger equation.",
                                    Hinglish:
                                        "Agar electron wave-like behavior dikha sakta hai, to hume ek rule chahiye jo us behavior ko describe kar sake. Wahi rule Schrodinger equation hai.",
                                },
                                {
                                    English:
                                        "Classical mechanics asks for position and path. Quantum mechanics asks for the wavefunction and probability. This topic explains that change of language.",
                                    Hinglish:
                                        "Classical mechanics position aur path poochti hai. Quantum mechanics wavefunction aur probability poochti hai. Yeh topic language ke is change ko explain karta hai.",
                                },
                                {
                                    English:
                                        "The Schrodinger equation is not random mathematics. It is a response to the fact that microscopic particles need a new kind of description.",
                                    Hinglish:
                                        "Schrodinger equation random mathematics nahi hai. Yeh is fact ka response hai ki microscopic particles ko new type ka description chahiye.",
                                },
                                {
                                    English:
                                        "When you study this topic, keep one thought in mind: the equation exists because nature at small scales behaves in a way that ordinary path-based thinking cannot fully capture.",
                                    Hinglish:
                                        "Is topic ko padhte waqt ek baat yaad rakho: equation isliye exist karti hai kyunki small scale par nature aise behave karti hai jise ordinary path-based thinking fully capture nahi kar sakti.",
                                },
                            ],
                            Content: {
                                RawContent: `Classical physics is very powerful for everyday objects. If you throw a ball, you can track where it is and predict where it will go. But electrons and atoms do not always behave like tiny balls.

At very small scales, particles can show wave-like behavior. They can spread, interfere, and create patterns that classical physics cannot explain using only exact paths.

[EXAMPLE:ElectronPattern]

This is why quantum mechanics uses a wavefunction. The Schrodinger equation is the rule that tells us how that wavefunction behaves.

[HINT:DoNotSearchForOnlyOnePath]

[ASSET:QuantumNeedCard]

The simple idea is this: classical physics tracks a path, but quantum mechanics predicts possible results and their probabilities.`,
                                AIExplanations: [
                                    {
                                        English:
                                            "Imagine I am teaching this in class. For a ball, you can draw a clean path. For an electron, that picture is not enough, because the electron can behave like a wave. So we need a new equation, and that equation is the Schrodinger equation.",
                                        Hinglish:
                                            "Socho main class mein padha raha hoon. Ball ke liye tum clean path draw kar sakte ho. Electron ke liye yeh picture enough nahi hoti, kyunki electron wave ki tarah behave kar sakta hai. Isliye hume new equation chahiye, aur woh Schrodinger equation hai.",
                                    },
                                    {
                                        English:
                                            "A very easy way to understand this is to compare a cricket ball and an electron. The cricket ball mostly follows a path. The electron is described better by a wavefunction, because we are often predicting chances, not drawing a fixed route.",
                                        Hinglish:
                                            "Isko samajhne ka easy way hai cricket ball aur electron compare karna. Cricket ball mostly ek path follow karti hai. Electron ko wavefunction se better describe karte hain, kyunki hum fixed route nahi, chances predict kar rahe hote hain.",
                                    },
                                    {
                                        English:
                                            "The reason we need the Schrodinger equation is not because old physics was foolish. Classical physics works in its own area. But for tiny particles, experiments show wave-like behavior, so the mathematical description also has to become wave-based.",
                                        Hinglish:
                                            "Schrodinger equation ki need isliye nahi hai ki old physics foolish thi. Classical physics apni jagah kaam karti hai. Lekin tiny particles ke experiments wave-like behavior dikhate hain, isliye mathematical description bhi wave-based honi chahiye.",
                                    },
                                    {
                                        English:
                                            "When you see the word quantum, do not immediately think of difficult formulas. First think of a change in question. Instead of asking, what exact path did the particle take, we ask, what outcomes are possible and how likely are they.",
                                        Hinglish:
                                            "Quantum word dekhte hi difficult formulas mat socho. Pehle question ka change samjho. Hum yeh nahi poochte ki particle ne exact kaunsa path liya. Hum poochte hain kaun se outcomes possible hain aur unki likelihood kitni hai.",
                                    },
                                    {
                                        English:
                                            "The takeaway is simple but powerful. The Schrodinger equation is the starting rule for the wavefunction. Once the wavefunction is known, we can calculate probabilities, understand allowed states, and explain behavior that classical motion cannot explain.",
                                        Hinglish:
                                            "Takeaway simple but powerful hai. Schrodinger equation wavefunction ka starting rule hai. Jab wavefunction pata hota hai, hum probabilities calculate kar sakte hain, allowed states samajh sakte hain, aur aisa behavior explain kar sakte hain jo classical motion explain nahi kar pati.",
                                    },
                                ],
                                Examples: [
                                    {
                                        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                        ExampleName: "ElectronPattern",
                                        Explanation: {
                                            English:
                                                "When many electrons pass through a narrow opening, the final screen pattern can look wave-like instead of like a simple pile of tiny bullets.",
                                            Hinglish:
                                                "Jab bahut saare electrons narrow opening se pass hote hain, final screen pattern simple tiny bullets ke pile jaisa nahi, balki wave-like lag sakta hai.",
                                        },
                                    },
                                ],
                                Hints: [
                                    {
                                        HintName: "DoNotSearchForOnlyOnePath",
                                        Hint: "Do not force the electron into a single fixed path. Think about possible results.",
                                    },
                                ],
                                CommonMistakes: [
                                    "Thinking an electron is just a smaller cricket ball.",
                                    "Assuming probability means there is no useful information.",
                                    "Jumping to formulas before understanding why the equation is needed.",
                                ],
                                Asset: {
                                    Type: ASSET_TYPES.IMAGE,
                                    AssetName: "QuantumNeedCard",
                                    FileName: "topic-01-quantum-need-card.svg",
                                    Svg: createInfoCardSvg(
                                        "Why a Quantum Equation?",
                                        "From exact paths to probabilities",
                                        [
                                            "Large objects: path-based motion.",
                                            "Tiny particles: wave-like behavior.",
                                            "Wavefunction: stores quantum information.",
                                            "Schrodinger equation: rule for the wavefunction.",
                                        ]
                                    ),
                                },
                                Questions: [
                                    {
                                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                                        Question: "Why do we need the Schrodinger equation?",
                                        Options: [
                                            "To describe wave-like quantum behavior",
                                            "To remove probability from physics",
                                            "To make classical physics useless",
                                            "To calculate only speed",
                                        ],
                                        Answer: "To describe wave-like quantum behavior",
                                        Explanation: {
                                            English:
                                                "The equation is needed because microscopic particles can show wave-like behavior that requires a wavefunction-based description.",
                                            Hinglish:
                                                "Equation isliye chahiye kyunki microscopic particles wave-like behavior dikha sakte hain, jise wavefunction-based description chahiye hota hai.",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            Title: "Matter Waves and the Wavefunction",
                            Description:
                                "A student-friendly explanation of matter waves and what the wavefunction is trying to describe.",
                            DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                            Keywords: [
                                "matter waves",
                                "de Broglie",
                                "wavefunction",
                                "psi",
                                "probability",
                            ],
                            AIExplanations: [
                                {
                                    English:
                                        "This topic introduces the wavefunction after students understand why classical paths are not enough. The idea is simple: tiny particles need a wave-like description.",
                                    Hinglish:
                                        "Yeh topic wavefunction introduce karta hai jab students samajh lete hain ki classical paths enough nahi hain. Idea simple hai: tiny particles ko wave-like description chahiye.",
                                },
                                {
                                    English:
                                        "Matter waves do not mean the electron becomes a water wave. It means the electron is described by a wavefunction that helps us predict possible results.",
                                    Hinglish:
                                        "Matter waves ka matlab yeh nahi ki electron water wave ban jata hai. Matlab yeh hai ki electron ko wavefunction se describe karte hain jo possible results predict karne mein help karta hai.",
                                },
                                {
                                    English:
                                        "The wavefunction is usually written as psi. It is a probability amplitude, so it is connected to probability after we take the square of its magnitude.",
                                    Hinglish:
                                        "Wavefunction usually psi se likha jata hai. Yeh probability amplitude hota hai, isliye probability se tab connect hota hai jab hum uske magnitude ka square lete hain.",
                                },
                                {
                                    English:
                                        "Students often imagine the wavefunction as a physical string moving up and down. A safer way is to treat it as a mathematical description of the quantum state.",
                                    Hinglish:
                                        "Students aksar wavefunction ko physical string jaise up-down move karta hua imagine karte hain. Safer way yeh hai ki ise quantum state ka mathematical description samjho.",
                                },
                                {
                                    English:
                                        "This topic prepares students for the Schrodinger equation because the equation is not acting on a tiny ball. It is acting on the wavefunction.",
                                    Hinglish:
                                        "Yeh topic students ko Schrodinger equation ke liye prepare karta hai kyunki equation tiny ball par act nahi kar rahi hoti. Yeh wavefunction par act karti hai.",
                                },
                            ],
                            Content: {
                                RawContent: `Matter waves are the idea that tiny particles can show wave-like behavior. This does not mean the particle is exactly like a water wave. It means the particle needs a wave-based mathematical description.

That description is called the wavefunction, usually written as psi. The wavefunction stores information about the quantum state.

[EXAMPLE:PerfumeSpread]

The wavefunction itself is not the final probability. To get probability density, we use the square of the magnitude of the wavefunction.

[HINT:PsiIsInformation]

[ASSET:MatterWaveCard]

So the learning order is: matter can behave like a wave, the wavefunction describes that behavior, and probability comes from the wavefunction.`,
                                AIExplanations: [
                                    {
                                        English:
                                            "Let me explain matter waves simply. In quantum physics, an electron is not best described as a tiny hard ball. It has wave-like behavior, so we describe it using a wavefunction called psi.",
                                        Hinglish:
                                            "Matter waves ko simple tareeke se samjho. Quantum physics mein electron ko tiny hard ball ki tarah best describe nahi karte. Uska wave-like behavior hota hai, isliye hum use psi naam ke wavefunction se describe karte hain.",
                                    },
                                    {
                                        English:
                                            "Think of the wavefunction as a special information map. It does not show a normal path. It helps us know where the particle is more likely or less likely to be found.",
                                        Hinglish:
                                            "Wavefunction ko ek special information map samjho. Yeh normal path nahi dikhata. Yeh help karta hai samajhne mein ki particle kahan zyada likely ya kam likely mil sakta hai.",
                                    },
                                    {
                                        English:
                                            "The word wave can confuse students. Here, wave means the description has shape, spread, and interference-like behavior. The measurable probability comes later, from the square of the magnitude of psi.",
                                        Hinglish:
                                            "Wave word students ko confuse kar sakta hai. Yahan wave ka matlab hai description mein shape, spread, aur interference-like behavior hota hai. Measurable probability baad mein aati hai, psi ke magnitude ke square se.",
                                    },
                                    {
                                        English:
                                            "A common confusion is to ask, where is the wavefunction physically located? It is better to ask what information the wavefunction gives us about possible measurement results.",
                                        Hinglish:
                                            "Common confusion yeh hai ki wavefunction physically kahan located hai. Better question yeh hai ki wavefunction hume possible measurement results ke baare mein kya information deta hai.",
                                    },
                                    {
                                        English:
                                            "The final teacher summary is this: matter waves justify using a wavefunction, the wavefunction describes the quantum state, and the Schrodinger equation tells us how that wavefunction behaves.",
                                        Hinglish:
                                            "Final teacher summary yeh hai: matter waves wavefunction use karne ka reason deti hain, wavefunction quantum state describe karta hai, aur Schrodinger equation batati hai ki wavefunction kaise behave karta hai.",
                                    },
                                ],
                                Examples: [
                                    {
                                        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                        ExampleName: "PerfumeSpread",
                                        Explanation: {
                                            English:
                                                "Perfume in a room does not stay at one point. It spreads. This is not exactly a quantum wave, but it helps students imagine why a spread-out description can be useful.",
                                            Hinglish:
                                                "Room mein perfume ek point par nahi rehta. Woh spread hota hai. Yeh exactly quantum wave nahi hai, lekin students ko imagine karne mein help karta hai ki spread-out description useful kyun ho sakta hai.",
                                        },
                                    },
                                ],
                                Hints: [
                                    {
                                        HintName: "PsiIsInformation",
                                        Hint: "Treat psi as information about the quantum state, not as a visible water wave.",
                                    },
                                ],
                                CommonMistakes: [
                                    "Thinking matter waves are exactly the same as water waves.",
                                    "Calling the wavefunction a direct probability.",
                                    "Forgetting that probability density comes from the square of the magnitude of psi.",
                                ],
                                Asset: {
                                    Type: ASSET_TYPES.IMAGE,
                                    AssetName: "MatterWaveCard",
                                    FileName: "topic-02-matter-wave-card.svg",
                                    Svg: createInfoCardSvg(
                                        "Matter Waves",
                                        "Why psi becomes useful",
                                        [
                                            "Tiny particles can show wave-like behavior.",
                                            "Psi describes the quantum state.",
                                            "Psi is a probability amplitude.",
                                            "Probability comes from the square of its magnitude.",
                                        ]
                                    ),
                                },
                                Questions: [
                                    {
                                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                                        Question: "What is the wavefunction mainly used for?",
                                        Options: [
                                            "To describe the quantum state and calculate probabilities",
                                            "To show a fixed classical path",
                                            "To remove wave behavior",
                                            "To make all energies equal",
                                        ],
                                        Answer: "To describe the quantum state and calculate probabilities",
                                        Explanation: {
                                            English:
                                                "The wavefunction describes the quantum state, and its squared magnitude gives probability density.",
                                            Hinglish:
                                                "Wavefunction quantum state describe karta hai, aur uske squared magnitude se probability density milti hai.",
                                        },
                                    },
                                ],
                            },
                        },

                        {
                            Title: "Psi and Probability Density",
                            Description:
                                "A simple explanation of psi and why the square of its magnitude matters.",
                            DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                            Keywords: [
                                "wavefunction",
                                "psi",
                                "probability density",
                                "normalization",
                            ],
                            AIExplanations: [
                                {
                                    English:
                                        "Psi is the wavefunction. It is the quantum description of the system, and it helps us find probabilities.",
                                    Hinglish:
                                        "Psi wavefunction hai. Yeh system ka quantum description hai, aur probabilities find karne mein help karta hai.",
                                },
                                {
                                    English:
                                        "Do not imagine psi as a normal water wave. It is a probability amplitude, which means it carries information used to calculate probability.",
                                    Hinglish:
                                        "Psi ko normal water wave ki tarah imagine mat karo. Yeh probability amplitude hai, matlab yeh probability calculate karne wali information carry karta hai.",
                                },
                                {
                                    English:
                                        "The square of the magnitude of psi gives probability density. Bigger probability density means a higher chance of finding the particle there.",
                                    Hinglish:
                                        "Psi ke magnitude ka square probability density deta hai. Jahan probability density zyada hai, wahan particle milne ki chance zyada hai.",
                                },
                                {
                                    English:
                                        "Normalization means the total probability must be one. In simple words, if the particle exists in the allowed region, the total chance of finding it somewhere must be complete.",
                                    Hinglish:
                                        "Normalization ka matlab total probability one honi chahiye. Simple words mein, agar particle allowed region mein exist karta hai, to usse kahin na kahin find karne ki total chance complete honi chahiye.",
                                },
                                {
                                    English:
                                        "This topic is the bridge between abstract math and measurement. Psi may look abstract, but the square of its magnitude connects it to real experimental results.",
                                    Hinglish:
                                        "Yeh topic abstract maths aur measurement ke beech bridge hai. Psi abstract lag sakta hai, lekin uske magnitude ka square real experimental results se connect karta hai.",
                                },
                            ],
                            Content: {
                                RawContent: `The wavefunction is usually written as psi. It describes the quantum state of a particle. Psi is not directly what we measure, but it contains the information we need.

To get probability density, we use the square of the magnitude of psi. This tells us where the particle is more likely or less likely to be found.

[EXAMPLE:BrightRoomAnalogy]

If the total probability is one, the wavefunction is normalized. That means the particle must be found somewhere in the allowed region.

[HINT:SquareBeforeProbability]

[ASSET:ProbabilityDensityCard]

So the simple chain is: wavefunction first, square its magnitude second, probability meaning third.`,
                                AIExplanations: [
                                    {
                                        English:
                                            "Let me teach this slowly. Psi is not the probability itself. Psi is the wavefunction. It stores the information. When we want probability, we take the square of the magnitude of psi.",
                                        Hinglish:
                                            "Isko slow samjho. Psi khud probability nahi hai. Psi wavefunction hai. Yeh information store karta hai. Jab hume probability chahiye hoti hai, hum psi ke magnitude ka square lete hain.",
                                    },
                                    {
                                        English:
                                            "Think of psi like a map that is not yet colored. When you take the square of its magnitude, the map gets brightness. Brighter regions mean the particle is more likely to be found there.",
                                        Hinglish:
                                            "Psi ko ek aise map ki tarah socho jo abhi colored nahi hai. Jab tum uske magnitude ka square lete ho, map bright ho jata hai. Brighter regions ka matlab particle wahan milne ki chance zyada hai.",
                                    },
                                    {
                                        English:
                                            "The important distinction is amplitude versus probability. The wavefunction is a probability amplitude. The measurable probability density comes after squaring the magnitude.",
                                        Hinglish:
                                            "Important distinction amplitude aur probability ka hai. Wavefunction probability amplitude hai. Measurable probability density magnitude square karne ke baad aati hai.",
                                    },
                                    {
                                        English:
                                            "Normalization is a very human idea. If the particle is allowed to exist in a region, then the total chance of finding it somewhere in that region should add up to one.",
                                        Hinglish:
                                            "Normalization ek bahut human idea hai. Agar particle kisi region mein exist kar sakta hai, to us region mein kahin na kahin particle milne ki total chance one honi chahiye.",
                                    },
                                    {
                                        English:
                                            "Here is the full teacher recap. Psi describes the quantum state. The square of the magnitude of psi gives probability density. Normalization makes sure the total probability is one. This is how abstract wave math becomes measurable physics.",
                                        Hinglish:
                                            "Teacher recap yeh hai. Psi quantum state describe karta hai. Psi ke magnitude ka square probability density deta hai. Normalization ensure karta hai ki total probability one ho. Isi tarah abstract wave math measurable physics ban jata hai.",
                                    },
                                ],
                                Examples: [
                                    {
                                        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                        ExampleName: "BrightRoomAnalogy",
                                        Explanation: {
                                            English:
                                                "Imagine a room with brighter and darker areas. A brighter area represents larger probability density, so the particle is more likely to be found there.",
                                            Hinglish:
                                                "Ek room imagine karo jisme bright aur dark areas hain. Bright area larger probability density show karta hai, isliye particle wahan milne ki chance zyada hai.",
                                        },
                                    },
                                ],
                                Hints: [
                                    {
                                        HintName: "SquareBeforeProbability",
                                        Hint: "First square the magnitude of psi. Then talk about probability.",
                                    },
                                ],
                                CommonMistakes: [
                                    "Calling psi itself the probability.",
                                    "Forgetting to square the magnitude of psi.",
                                    "Ignoring normalization.",
                                ],
                                Asset: {
                                    Type: ASSET_TYPES.IMAGE,
                                    AssetName: "ProbabilityDensityCard",
                                    FileName: "topic-03-probability-density-card.svg",
                                    Svg: createInfoCardSvg(
                                        "Psi and Probability",
                                        "How the wavefunction becomes measurable",
                                        [
                                            "Psi is the wavefunction.",
                                            "The square of its magnitude gives probability density.",
                                            "Normalization means total probability is one.",
                                            "Higher density means higher chance.",
                                        ]
                                    ),
                                },
                                Questions: [
                                    {
                                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                                        Question: "What gives probability density?",
                                        Options: [
                                            "The square of the magnitude of psi",
                                            "Psi without any operation",
                                            "Only the particle speed",
                                            "Only the particle mass",
                                        ],
                                        Answer: "The square of the magnitude of psi",
                                        Explanation: {
                                            English:
                                                "Probability density comes from the square of the magnitude of the wavefunction.",
                                            Hinglish:
                                                "Probability density wavefunction ke magnitude ke square se aati hai.",
                                        },
                                    },
                                ],
                            },
                        },
            ],
        },
        {
            Title: "Using the Equation",
            Description:
                "This chapter shows how the Schrodinger equation becomes useful in common student problems.",
            AIExplanations: [
                {
                    English:
                        "This chapter moves from meaning to use. Now that the wavefunction idea is clear, we can see how the equation helps solve real quantum problems.",
                    Hinglish:
                        "Yeh chapter meaning se use ki taraf move karta hai. Ab wavefunction ka idea clear hai, to hum dekh sakte hain equation real quantum problems solve karne mein kaise help karti hai.",
                },
                {
                    English:
                        "We will focus on standard student examples, because examples make the equation feel less abstract.",
                    Hinglish:
                        "Hum standard student examples par focus karenge, kyunki examples equation ko kam abstract feel karwate hain.",
                },
                {
                    English:
                        "The chapter introduces stationary states, allowed energies, the particle in a box, and tunneling.",
                    Hinglish:
                        "Yeh chapter stationary states, allowed energies, particle in a box, aur tunneling introduce karta hai.",
                },
                {
                    English:
                        "The main lesson is that boundary conditions and the wavefunction shape decide which states are physically allowed.",
                    Hinglish:
                        "Main lesson yeh hai ki boundary conditions aur wavefunction shape decide karte hain kaun se states physically allowed hain.",
                },
                {
                    English:
                        "By the end of this chapter, students should see the Schrodinger equation as a practical method, not just a symbolic statement.",
                    Hinglish:
                        "Is chapter ke end tak students ko Schrodinger equation practical method jaisi lagni chahiye, sirf symbolic statement jaisi nahi.",
                },
            ],
            Topics: [
                        {
                            Title: "Time-Independent Equation and Boundaries",
                            Description:
                                "How stable potentials and boundary conditions create allowed wavefunctions.",
                            DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                            Keywords: [
                                "time-independent",
                                "stationary states",
                                "boundary conditions",
                                "energy",
                            ],
                            AIExplanations: [
                                {
                                    English:
                                        "This topic explains the version of the equation students use most often in basic problems.",
                                    Hinglish:
                                        "Yeh topic equation ke us version ko explain karta hai jo basic problems mein students sabse zyada use karte hain.",
                                },
                                {
                                    English:
                                        "If the potential is stable with time, we can focus on the spatial shape of the wavefunction.",
                                    Hinglish:
                                        "Agar potential time ke saath stable hai, to hum wavefunction ke spatial shape par focus kar sakte hain.",
                                },
                                {
                                    English:
                                        "Boundary conditions decide which solutions are acceptable. This is why energy can come in fixed levels.",
                                    Hinglish:
                                        "Boundary conditions decide karti hain ki kaun se solutions acceptable hain. Isi wajah se energy fixed levels mein aa sakti hai.",
                                },
                                {
                                    English:
                                        "The time-independent equation is not a different theory. It is a useful form for systems whose potential does not change with time.",
                                    Hinglish:
                                        "Time-independent equation different theory nahi hai. Yeh un systems ke liye useful form hai jinka potential time ke saath change nahi hota.",
                                },
                                {
                                    English:
                                        "The big takeaway is that the physical setup chooses the mathematical solutions. Not every function that solves the equation is physically allowed.",
                                    Hinglish:
                                        "Big takeaway yeh hai ki physical setup mathematical solutions choose karta hai. Har function jo equation solve karta hai, physically allowed nahi hota.",
                                },
                            ],
                            Content: {
                                RawContent: `When potential energy does not change with time, students often use the time-independent Schrodinger equation. This form helps us find allowed wavefunctions and allowed energies.

The key idea is boundary conditions. A wavefunction must match the physical limits of the system. If a wavefunction does not satisfy the boundaries, it is not accepted as a physical solution.

[EXAMPLE:StringFixedAtEnds]

This is why quantum energy can become quantized. Only certain wave shapes fit the situation, so only certain energies are allowed.

[HINT:CheckTheBoundaries]

[ASSET:BoundaryEnergyCard]

So the solving process is: understand the system, write the equation, apply boundaries, and interpret the allowed results.`,
                                AIExplanations: [
                                    {
                                        English:
                                            "Let us make this very simple. When the outside situation is not changing with time, we can use the time-independent form. This helps us focus on the shape of the wavefunction in space.",
                                        Hinglish:
                                            "Isko very simple banate hain. Jab outside situation time ke saath change nahi ho rahi hoti, hum time-independent form use kar sakte hain. Yeh hume space mein wavefunction ke shape par focus karne mein help karta hai.",
                                    },
                                    {
                                        English:
                                            "Think about a string tied at both ends. It cannot vibrate in every possible shape. In the same way, a quantum wavefunction must fit the boundaries of the system.",
                                        Hinglish:
                                            "Ek string socho jo dono ends par tied hai. Woh har possible shape mein vibrate nahi kar sakti. Same way, quantum wavefunction ko system ki boundaries mein fit hona padta hai.",
                                    },
                                    {
                                        English:
                                            "Boundary conditions are not just mathematical steps. They are physical rules. They tell the equation which wavefunctions make sense for the actual system.",
                                        Hinglish:
                                            "Boundary conditions sirf mathematical steps nahi hain. Yeh physical rules hain. Yeh equation ko batati hain ki actual system ke liye kaun se wavefunctions sense banate hain.",
                                    },
                                    {
                                        English:
                                            "Allowed energies appear because allowed wavefunctions are limited. If only certain wave shapes can exist, then only the energies connected with those shapes can exist.",
                                        Hinglish:
                                            "Allowed energies isliye appear hoti hain kyunki allowed wavefunctions limited hote hain. Agar sirf kuch wave shapes exist kar sakte hain, to un shapes se connected energies hi exist kar sakti hain.",
                                    },
                                    {
                                        English:
                                            "The final idea is this: solving the Schrodinger equation is not only algebra. It is algebra plus physical meaning. The boundaries, the wavefunction, and the energy must all agree with the system.",
                                        Hinglish:
                                            "Final idea yeh hai: Schrodinger equation solve karna sirf algebra nahi hai. Yeh algebra plus physical meaning hai. Boundaries, wavefunction, aur energy sab system ke saath agree karne chahiye.",
                                    },
                                ],
                                Examples: [
                                    {
                                        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                        ExampleName: "StringFixedAtEnds",
                                        Explanation: {
                                            English:
                                                "A guitar string fixed at both ends can form only certain standing wave patterns. A quantum wavefunction in a restricted region behaves similarly.",
                                            Hinglish:
                                                "Guitar string jo dono ends par fixed hoti hai, sirf kuch standing wave patterns bana sakti hai. Restricted region mein quantum wavefunction bhi similar behave karta hai.",
                                        },
                                    },
                                ],
                                Hints: [
                                    {
                                        HintName: "CheckTheBoundaries",
                                        Hint: "After solving, always check if the wavefunction fits the physical boundaries.",
                                    },
                                ],
                                CommonMistakes: [
                                    "Solving the equation but ignoring boundary conditions.",
                                    "Thinking every mathematical solution is physically valid.",
                                    "Forgetting that fixed energy levels come from allowed wave shapes.",
                                ],
                                Asset: {
                                    Type: ASSET_TYPES.IMAGE,
                                    AssetName: "BoundaryEnergyCard",
                                    FileName: "topic-04-boundary-energy-card.svg",
                                    Svg: createInfoCardSvg(
                                        "Boundaries and Energy",
                                        "Why only some wavefunctions are allowed",
                                        [
                                            "Stable potential: use time-independent form.",
                                            "Boundary conditions filter solutions.",
                                            "Allowed wavefunctions create allowed energies.",
                                            "Physical meaning matters after algebra.",
                                        ]
                                    ),
                                },
                                Questions: [
                                    {
                                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                                        Question: "What do boundary conditions help decide?",
                                        Options: [
                                            "Which wavefunctions are physically allowed",
                                            "The color of the particle",
                                            "Whether probability should be ignored",
                                            "Whether time exists",
                                        ],
                                        Answer: "Which wavefunctions are physically allowed",
                                        Explanation: {
                                            English:
                                                "Boundary conditions filter the mathematical solutions and keep only the ones that match the physical system.",
                                            Hinglish:
                                                "Boundary conditions mathematical solutions ko filter karti hain aur sirf unhe rakhti hain jo physical system se match karte hain.",
                                        },
                                    },
                                ],
                            },
                        },

                        {
                            Title: "Two Classic Results",
                            Description:
                                "How the equation explains quantized energy and tunneling in a simple way.",
                            DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                            Keywords: ["particle in a box", "tunneling", "quantization", "barrier"],
                            AIExplanations: [
                                {
                                    English:
                                        "This topic gives two important results: a trapped particle has fixed energy levels, and a quantum particle can sometimes tunnel through a barrier.",
                                    Hinglish:
                                        "Yeh topic do important results deta hai: trapped particle ke fixed energy levels hote hain, aur quantum particle kabhi-kabhi barrier ke through tunnel kar sakta hai.",
                                },
                                {
                                    English:
                                        "The particle in a box is like a wave that must fit between two walls.",
                                    Hinglish:
                                        "Particle in a box ek wave jaisa hai jise do walls ke beech fit hona padta hai.",
                                },
                                {
                                    English:
                                        "Tunneling happens because the wavefunction does not always become zero immediately inside a barrier.",
                                    Hinglish:
                                        "Tunneling isliye hota hai kyunki wavefunction barrier ke andar immediately zero nahi hota.",
                                },
                                {
                                    English:
                                        "Both examples teach the same lesson: the wavefunction shape controls what can happen.",
                                    Hinglish:
                                        "Dono examples same lesson dete hain: wavefunction ka shape decide karta hai ki kya ho sakta hai.",
                                },
                                {
                                    English:
                                        "These examples are famous because they show the equation creating predictions that classical thinking would miss.",
                                    Hinglish:
                                        "Yeh examples famous hain kyunki yeh dikhate hain ki equation aise predictions banati hai jo classical thinking miss kar deti.",
                                },
                            ],
                            Content: {
                                RawContent: `A particle in a box is a simple model where a particle is trapped between two walls. The wavefunction must be zero at the walls, so only certain standing wave shapes fit.

[EXAMPLE:StandingWaveInBox]

Because only certain shapes fit, only certain energies are allowed. This is called quantization.

Tunneling is different but equally important. If a particle faces a barrier, classical physics may say it cannot cross. Quantum mechanics says the wavefunction can enter the barrier and may leave a small chance of finding the particle on the other side.

[HINT:WaveDoesNotStopInstantly]

[ASSET:BoxAndTunnelingCard]

These two examples show the power of the Schrodinger equation: it predicts allowed energies and also explains behavior that feels impossible in classical physics.`,
                                AIExplanations: [
                                    {
                                        English:
                                            "Let us teach this with a picture. A particle in a box is trapped between two walls. The wavefunction has to fit inside the box, so only some wave shapes are allowed. Those allowed shapes give allowed energies.",
                                        Hinglish:
                                            "Isko picture ke saath samjho. Particle in a box do walls ke beech trapped hai. Wavefunction ko box ke andar fit hona padta hai, isliye sirf kuch wave shapes allowed hain. Wahi allowed shapes allowed energies deti hain.",
                                    },
                                    {
                                        English:
                                            "Think of the box like a guitar string fixed at both ends. The string cannot vibrate in any random shape. In the same way, the quantum wavefunction can only take shapes that satisfy the walls.",
                                        Hinglish:
                                            "Box ko guitar string ki tarah socho jo dono ends par fixed hai. String random shape mein vibrate nahi kar sakti. Same way, quantum wavefunction sirf wahi shapes le sakta hai jo walls ko satisfy karte hain.",
                                    },
                                    {
                                        English:
                                            "Now look at tunneling. Classically, if the particle does not have enough energy, it should not cross the barrier. Quantum mechanically, the wavefunction can leak into the barrier, so there can be a small chance on the other side.",
                                        Hinglish:
                                            "Ab tunneling dekho. Classically, agar particle ke paas enough energy nahi hai, to woh barrier cross nahi karega. Quantum mechanically, wavefunction barrier ke andar leak kar sakta hai, isliye other side par small chance ho sakti hai.",
                                    },
                                    {
                                        English:
                                            "The box and tunneling examples look different, but both are controlled by the wavefunction. In the box, the wavefunction must fit. In tunneling, the wavefunction can decay through a barrier instead of stopping suddenly.",
                                        Hinglish:
                                            "Box aur tunneling examples different lagte hain, lekin dono wavefunction se control hote hain. Box mein wavefunction ko fit hona padta hai. Tunneling mein wavefunction suddenly stop hone ke bajay barrier ke through decay kar sakta hai.",
                                    },
                                    {
                                        English:
                                            "Here is the final teacher version. The Schrodinger equation predicts which wavefunctions are allowed. In a box, that gives fixed energy levels. Near a barrier, it gives tunneling probability. This is why the equation is so powerful.",
                                        Hinglish:
                                            "Final teacher version yeh hai. Schrodinger equation predict karti hai kaun se wavefunctions allowed hain. Box mein yeh fixed energy levels deti hai. Barrier ke paas yeh tunneling probability deti hai. Isi wajah se equation itni powerful hai.",
                                    },
                                ],
                                Examples: [
                                    {
                                        DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                        ExampleName: "StandingWaveInBox",
                                        Explanation: {
                                            English:
                                                "A wave on a string fixed at both ends can only fit in certain patterns. A particle in a box has a similar standing-wave condition.",
                                            Hinglish:
                                                "Dono ends par fixed string par wave sirf kuch patterns mein fit hoti hai. Particle in a box mein bhi similar standing-wave condition hoti hai.",
                                        },
                                    },
                                ],
                                Hints: [
                                    {
                                        HintName: "WaveDoesNotStopInstantly",
                                        Hint: "For tunneling, remember that the wavefunction usually decays inside the barrier instead of becoming zero immediately.",
                                    },
                                ],
                                CommonMistakes: [
                                    "Thinking the particle in a box can have any energy.",
                                    "Forgetting that the wavefunction must be zero at rigid walls.",
                                    "Explaining tunneling as magic instead of wavefunction behavior.",
                                ],
                                Asset: {
                                    Type: ASSET_TYPES.IMAGE,
                                    AssetName: "BoxAndTunnelingCard",
                                    FileName: "topic-05-box-and-tunneling-card.svg",
                                    Svg: createInfoCardSvg(
                                        "Box and Tunneling",
                                        "Two classic uses of the equation",
                                        [
                                            "Box: only certain wave shapes fit.",
                                            "Allowed shapes create allowed energies.",
                                            "Barrier: wavefunction can decay through.",
                                            "Tunneling means small probability beyond the barrier.",
                                        ]
                                    ),
                                },
                                Questions: [
                                    {
                                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                                        Question:
                                            "Why are energies quantized in a particle in a box?",
                                        Options: [
                                            "Only certain wavefunction shapes fit the boundaries",
                                            "The particle loses all motion",
                                            "The barrier disappears",
                                            "Probability is ignored",
                                        ],
                                        Answer: "Only certain wavefunction shapes fit the boundaries",
                                        Explanation: {
                                            English:
                                                "The wavefunction must satisfy the walls of the box, so only certain standing wave shapes and energies are allowed.",
                                            Hinglish:
                                                "Wavefunction ko box ki walls satisfy karni hoti hain, isliye sirf kuch standing wave shapes aur energies allowed hoti hain.",
                                        },
                                    },
                                ],
                            },
                        },
            ],
        },
    ],
};

const buildCoursePayload = (subjectId: mongoose.Types.ObjectId, thumbnailKey?: string) => ({
    SubjectIds: [subjectId],
    Thumbnail: thumbnailKey,
    Title: schrodingerCourseScript.Course.Title,
    Description: schrodingerCourseScript.Course.Description,
    AIExplanations: schrodingerCourseScript.Course.AIExplanations,
    DifficultyLevel: schrodingerCourseScript.Course.DifficultyLevel,
    LanguageSupported: schrodingerCourseScript.Course.LanguageSupported,
    Tags: schrodingerCourseScript.Course.Tags,
    IsPublished: schrodingerCourseScript.Course.IsPublished,
    PublishedAt: new Date(),
});

const ensurePhysicsSubject = async () => {
    const subject = await Subject.findOneAndUpdate(
        { Name: SUBJECT_NAME },
        {
            $set: {
                Name: SUBJECT_NAME,
                Description:
                    "Physics courses that explain difficult concepts with clear language, examples, and student-friendly visuals.",
            },
        },
        { new: true, upsert: true }
    );

    if (!subject) {
        throw new Error("Failed to create or fetch the Physics subject");
    }

    return subject;
};

const resetExistingHierarchy = async (courseId: mongoose.Types.ObjectId) => {
    await Topic.deleteMany({ CourseId: courseId });
    await Chapter.deleteMany({ CourseId: courseId });
};

const upsertCourse = async (subjectId: mongoose.Types.ObjectId) => {
    let course = await Course.findOne({ Title: COURSE_TITLE });

    if (!course) {
        course = await Course.create(buildCoursePayload(subjectId));
    } else {
        await Course.findByIdAndUpdate(course._id, buildCoursePayload(subjectId));
    }

    const thumbnailUpload = await uploadCourseImageToS3(
        String(course._id),
        schrodingerCourseScript.ThumbnailAsset.FileName,
        Buffer.from(schrodingerCourseScript.ThumbnailAsset.Svg, "utf-8"),
        "image/svg+xml"
    );

    await Course.findByIdAndUpdate(course._id, buildCoursePayload(subjectId, thumbnailUpload.key));

    const updatedCourse = await Course.findById(course._id);

    if (!updatedCourse) {
        throw new Error("Failed to load the Schrodinger course after update");
    }

    return updatedCourse;
};

export const generateSchrodingerEquationCourse = async () => {
    const subject = await ensurePhysicsSubject();
    const course = await upsertCourse(subject._id);

    await resetExistingHierarchy(course._id);

    const createdChapterIds: string[] = [];
    const createdTopicIds: string[] = [];

    for (const [chapterIndex, chapterScript] of schrodingerCourseScript.Chapters.entries()) {
        const chapter = await Chapter.create({
            CourseId: course._id,
            Title: chapterScript.Title,
            Description: chapterScript.Description,
            AIExplanations: chapterScript.AIExplanations,
            Order: chapterIndex + 1,
        });

        createdChapterIds.push(String(chapter._id));

        for (const [topicIndex, topicScript] of chapterScript.Topics.entries()) {
                const assetUpload = await uploadCourseImageToS3(
                    String(course._id),
                    topicScript.Content.Asset.FileName,
                    Buffer.from(topicScript.Content.Asset.Svg, "utf-8"),
                    "image/svg+xml"
                );

                const topic = await Topic.create({
                    CourseId: course._id,
                    ChapterId: chapter._id,
                    Title: topicScript.Title,
                    Description: topicScript.Description,
                    DifficultyLevel: topicScript.DifficultyLevel,
                    Keywords: topicScript.Keywords,
                    AIExplanations: topicScript.AIExplanations,
                    Order: topicIndex + 1,
                    Content: {
                        RawContent: topicScript.Content.RawContent,
                        AIExplanations: topicScript.Content.AIExplanations,
                        Examples: topicScript.Content.Examples,
                        Hints: topicScript.Content.Hints,
                        CommonMistakes: topicScript.Content.CommonMistakes,
                        Assets: [
                            {
                                Type: topicScript.Content.Asset.Type,
                                AssetURI: assetUpload.key,
                                AssetName: topicScript.Content.Asset.AssetName,
                            },
                        ],
                        Questions: topicScript.Content.Questions,
                    },
                });

                createdTopicIds.push(String(topic._id));
        }
    }

    return {
        Subject: {
            Id: String(subject._id),
            Name: subject.Name,
        },
        Course: {
            Id: String(course._id),
            Title: course.Title,
            Thumbnail: course.Thumbnail,
            LanguageSupported: course.LanguageSupported,
            DifficultyLevel: course.DifficultyLevel,
        },
        Summary: {
            ChapterCount: createdChapterIds.length,
            TopicCount: createdTopicIds.length,
        },
        CreatedIds: {
            ChapterIds: createdChapterIds,
            TopicIds: createdTopicIds,
        },
    };
};
