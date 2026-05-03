import mongoose from "mongoose";
import {
    ASSET_TYPES,
    DIFFICULTY_LEVELS,
    LANGUAGES_SUPPORTED,
    QUESTION_TYPES,
    TOPIC_TYPES,
} from "../../constants/course.constants";
import { uploadCourseImageToS3 } from "../../helpers/s3Helper";
import Chapter from "../../models/course/chapter.model";
import Course from "../../models/course/course.model";
import Subject from "../../models/course/subject.model";
import Topic from "../../models/course/topic.model";
import AIExplanation from "../../models/ai/aiexplanation.model";

const SUBJECT_NAME = "Physics";
const COURSE_TITLE = "Schrodinger Equation";

// ---------------------------------------------------------------------------
// SVG helper
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helper: create AIExplanation docs and return their ObjectIds
// ---------------------------------------------------------------------------

const createAIExplanationVersions = async (
    versions: Array<{ [key: string]: string }>
): Promise<mongoose.Types.ObjectId[]> => {
    const docs = await AIExplanation.insertMany(versions);
    return docs.map((d) => d._id as mongoose.Types.ObjectId);
};

// Helper: serialize a JSON-LD object into a string stored in SEO.JsonLd
const jsonLd = (data: object): string => JSON.stringify(data);

// ---------------------------------------------------------------------------
// Course script data
// ---------------------------------------------------------------------------

const schrodingerCourseScript = {
    Course: {
        Title: COURSE_TITLE,
        Description:
            "A simple, student-friendly course that explains what the Schrodinger equation means and how students should think about it.",
        AIExplanationVersions: [
            {
                [LANGUAGES_SUPPORTED.ENGLISH]:
                    "Think of the Schrodinger equation as the rule book for quantum particles. It does not tell us a neat path like a cricket ball. It tells us how the wavefunction changes, and the wavefunction helps us predict where the particle may be found.",
                [LANGUAGES_SUPPORTED.HINGLISH]:
                    "Schrodinger equation ko quantum particles ka rule book samjho. Yeh cricket ball jaisa clear path nahi batata. Yeh batata hai ki wavefunction kaise change hota hai, aur wavefunction se hum predict karte hain ki particle kahan mil sakta hai.",
            },
            {
                [LANGUAGES_SUPPORTED.ENGLISH]:
                    "This course is for students who feel the topic is scary because of symbols. We will keep the idea simple: first understand the wavefunction, then probability, then energy, and only after that the equation starts making sense.",
                [LANGUAGES_SUPPORTED.HINGLISH]:
                    "Yeh course un students ke liye hai jinko symbols dekhkar topic scary lagta hai. Hum idea simple rakhenge: pehle wavefunction samjho, phir probability, phir energy, aur uske baad equation sense banane lagti hai.",
            },
            {
                [LANGUAGES_SUPPORTED.ENGLISH]:
                    "The equation connects the state of a quantum system with its energy. In plain words, if we know the energy situation around a particle, the equation tells us what wavefunction shapes are possible.",
                [LANGUAGES_SUPPORTED.HINGLISH]:
                    "Yeh equation quantum system ki state ko uski energy se connect karti hai. Simple words mein, agar hume particle ke around energy situation pata hai, to equation batati hai ki kaun se wavefunction shapes possible hain.",
            },
            {
                [LANGUAGES_SUPPORTED.ENGLISH]:
                    "A common mistake is to ask where exactly the electron is moving at every second. In quantum mechanics, the better question is: what does the wavefunction allow, and what are the chances of each result?",
                [LANGUAGES_SUPPORTED.HINGLISH]:
                    "Common mistake yeh hai ki hum poochte hain electron har second exactly kahan move kar raha hai. Quantum mechanics mein better question yeh hai: wavefunction kya allow karta hai, aur har result ki chance kitni hai?",
            },
            {
                [LANGUAGES_SUPPORTED.ENGLISH]:
                    "By the end of this course, the equation should feel less like a formula to memorize and more like a tool. It helps us understand allowed energies, standing waves, probability density, and tunneling.",
                [LANGUAGES_SUPPORTED.HINGLISH]:
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
        SEO: {
            Slug: "schrodinger-equation",
            MetaTitle: "Schrodinger Equation \u2013 Beginner Quantum Mechanics Course | KickBi",
            MetaDescription: "Understand the Schrodinger equation with simple language. Covers wavefunction, probability density, particle in a box, and tunneling. Beginner-friendly.",
            OgTitle: "Schrodinger Equation | KickBi",
            OgDescription: "A beginner course on the Schrodinger equation. Wavefunction, probability, boundary conditions, and tunneling with clear examples.",
            CanonicalUrl: "/courses/schrodinger-equation",
            JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Course", "name": "Schrodinger Equation", "description": "A simple, student-friendly course explaining the Schrodinger equation and wavefunction.", "provider": { "@type": "Organization", "name": "KickBi" }, "educationalLevel": "Beginner", "inLanguage": "en-US" }),
        },
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
            SEO: {
                Slug: "building-the-idea",
                MetaTitle: "Building the Idea \u2013 Schrodinger Equation Chapter 1 | KickBi",
                MetaDescription: "Understand why the Schrodinger equation is needed. Learn about wave-like behavior, matter waves, and the wavefunction. Beginner-friendly chapter.",
                OgTitle: "Building the Idea | Schrodinger Equation | KickBi",
                OgDescription: "The foundations of quantum mechanics: why the equation matters, wave behavior, matter waves, and the wavefunction.",
                CanonicalUrl: "/courses/schrodinger-equation/chapters/building-the-idea",
                JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Building the Idea", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner", "learningResourceType": "Chapter" }),
            },
            AIExplanationVersions: [
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "In this chapter, we slow down and ask why the Schrodinger equation is needed at all. The goal is to make the equation feel natural, not sudden.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Is chapter mein hum slow chalenge aur samjhenge ki Schrodinger equation ki need kyun hai. Goal yeh hai ki equation natural lage, achanak se aayi hui nahi.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "Students often get confused because they meet the equation before they meet the problem. Here we first look at the problem: tiny particles behave differently from everyday objects.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Students confuse isliye hote hain kyunki equation pehle aa jati hai aur problem baad mein samajh aati hai. Yahan hum pehle problem dekhenge: tiny particles everyday objects se differently behave karte hain.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "The chapter introduces wave-like behavior, probability, and the wavefunction. These ideas are the foundation for reading the equation correctly.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Yeh chapter wave-like behavior, probability, aur wavefunction introduce karta hai. Equation ko sahi tarah read karne ke liye yeh ideas foundation hain.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "The main shift is from exact path thinking to probability thinking. Once that shift happens, the Schrodinger equation becomes much easier to accept.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Main shift exact path thinking se probability thinking ki taraf hai. Jab yeh shift ho jata hai, Schrodinger equation ko accept karna kaafi easy ho jata hai.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "Use this chapter as your intuition base. If later formulas feel confusing, come back here and remember that quantum mechanics starts with a different way of describing nature.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Is chapter ko intuition base ki tarah use karo. Agar baad mein formulas confusing lagen, to yahan wapas aakar yaad karo ki quantum mechanics nature ko describe karne ka different way hai.",
                },
            ],
            Topics: [
                {
                    TopicType: TOPIC_TYPES.THEORY,
                    Title: "Why We Need a Quantum Equation",
                    Description:
                        "A gentle introduction to why electrons and atoms need a wave-based equation.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["classical physics", "quantum", "electron", "wave behavior"],
                    SEO: {
                        Slug: "why-we-need-a-quantum-equation",
                        MetaTitle: "Why We Need a Quantum Equation | Schrodinger Equation | KickBi",
                        MetaDescription: "Discover why classical physics cannot explain electrons and why a wave-based equation is needed. A gentle first step into quantum mechanics.",
                        OgTitle: "Why We Need a Quantum Equation | KickBi",
                        OgDescription: "Learn why tiny particles behave differently from everyday objects and why the Schrodinger equation was created.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/why-we-need-a-quantum-equation",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Why We Need a Quantum Equation", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner", "learningResourceType": "Lesson" }),
                    },
                    Content: {
                        RawContent: `[H:H2] Why Classical Physics Breaks Down at Small Scales [/H:H2]

[P] For everything around you — a [SPAN] cricket ball [/SPAN] flying through the air, a car on a road, or the planets orbiting the sun — classical physics works perfectly. [B] Newton's laws [/B] let us calculate the exact position and velocity of any object at any time. If you know where a ball is right now and how fast it is moving, you can predict exactly where it will land. [/P]

[P] This predictability feels like the natural way the universe works. But it only holds for [B] large objects [/B]. When physicists began studying electrons, protons, and atoms in the early twentieth century, the comfortable world of classical physics fell apart. [/P]

[H:H2] The Double-Slit Experiment: The Problem That Changed Physics [/H:H2]

[P] One of the most famous experiments in history fires electrons at a thin barrier with two narrow slits. If electrons were tiny balls, you would expect two parallel lines to appear on the screen — one behind each slit. That is [B] not [/B] what happens. [/P]

[P] Instead, the screen shows an [B] interference pattern [/B] — a series of bright and dark bands, exactly like the pattern you get when two water waves overlap and either reinforce or cancel each other. This happens even when electrons are sent through the slits [B] one at a time [/B]. A single electron somehow interferes with itself. [/P]

[EXAMPLE:ElectronPattern]

[P] This is impossible to explain using classical physics. A tiny ball cannot interfere with itself. A wave can. This result tells us, clearly and without ambiguity, that electrons must be described as waves — not as particles following a fixed path. [/P]

[H:H2] The Fundamental Shift: From Paths to Probabilities [/H:H2]

[P] Classical physics asks: [B] Where is the particle right now, and where will it be next? [/B] Quantum mechanics asks something completely different: [B] What is the probability of finding the particle at each possible location? [/B] [/P]

[P] This shift is not a limitation of our instruments. It is a fundamental property of nature at the atomic scale. An electron does not have a single definite path the way a cricket ball does. Its future position is genuinely spread over a range of possibilities, each with a specific probability. [/P]

[HINT:DoNotSearchForOnlyOnePath]

[H:H2] What the Schrodinger Equation Does [/H:H2]

[P] We needed a new mathematical framework — one that works with waves and probabilities instead of paths. Erwin Schrodinger provided this framework in 1926. [/P]

[P] The Schrodinger equation does for quantum mechanics exactly what Newton's second law does for classical mechanics. Given the conditions of a system, it tells us how the [B] wavefunction [/B] evolves over time. The wavefunction is the mathematical object that stores all the quantum information about the particle. Once you have the wavefunction, you can calculate the probability of any measurable outcome. [/P]

[ASSET:QuantumNeedCard]

[H:H2] The Key Takeaway [/H:H2]

[P] Classical physics is not wrong — it is perfectly correct for large everyday objects. The Schrodinger equation is the correct tool for quantum particles. [B] Understanding why a new equation is needed is the most important first step into quantum mechanics. [/B] [/P]`,
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Think about throwing a cricket ball versus firing an electron. For the cricket ball, we can draw an exact arc through the air — every single point on that path is predictable. But when you fire an electron at two narrow slits, something completely unexpected happens. The electron does not go through one slit like a ball would. It produces an interference pattern on the other side, as if it went through both slits at once. That is wave behavior, not particle behavior. And that is precisely why we cannot use classical physics for electrons — and why we need the Schrodinger equation instead.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Socho cricket ball throw karna aur electron fire karna ka difference. Cricket ball ke liye hum exact arc draw kar sakte hain hawa mein — har point predictable hai. Lekin jab tum electron ko do narrow slits par fire karte ho, kuch completely unexpected hota hai. Electron ek slit se nahi jaata jaise ball jaati hai. Woh dusri taraf ek interference pattern banata hai, jaise woh dono slits se ek saath gaya ho. Yeh wave behavior hai, particle behavior nahi. Aur isliye exactly hum classical physics electrons ke liye use nahi kar sakte — aur isliye hume Schrodinger equation ki zaroorat padti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me give you a simple analogy. Imagine two groups of water waves meeting in a pond. Where the crests of both waves meet, you get a bigger wave. Where a crest meets a trough, they cancel out. This is interference. Now, quantum experiments show that electrons behave the same way — they build up an interference pattern on a screen. A tiny ball fired at a barrier would just hit a spot behind one slit. But electrons create this wave-like pattern. Nature is telling us that at small scales, the rules of classical physics simply do not apply, and we need the Schrodinger equation to handle this wave-like behavior.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe ek simple analogy deta hoon. Socho ki pond mein do groups of water waves mil rahi hain. Jahan dono waves ki crests milti hain, ek badi wave banti hai. Jahan ek crest ek trough se milti hai, woh cancel ho jaati hain. Yeh interference hai. Ab quantum experiments dikhate hain ki electrons bhi same tarah behave karte hain — woh screen par ek interference pattern banate hain. Ek tiny ball ek barrier par fire ki jaaye to woh ek slit ke peeche ek spot par hi hit karegi. Lekin electrons yeh wave-like pattern create karte hain. Nature hume bata rahi hai ki chhote scales par classical physics ke rules kaam nahi karte, aur hume is wave-like behavior ko handle karne ke liye Schrodinger equation chahiye.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me walk you through the logic step by step. Step one: classical physics describes the motion of objects as particles following exact paths — we can calculate exactly where they will be at any future time. Step two: experiments show that tiny particles like electrons create interference patterns, which is a wave behavior, not a particle behavior. Step three: to explain this, we need a wave-based mathematical description. Step four: that description is the wavefunction. Step five: the Schrodinger equation is the rule that governs how the wavefunction evolves. Each step is necessary, and together they explain why the Schrodinger equation exists.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe logic step by step walk-through karta hoon. Step one: classical physics object ki motion ko exact paths follow karne wale particles ki tarah describe karti hai — hum exactly calculate kar sakte hain woh future mein kahan honge. Step two: experiments dikhate hain ki tiny particles jaise electrons interference patterns create karte hain, jo wave behavior hai, particle behavior nahi. Step three: isko explain karne ke liye hume wave-based mathematical description chahiye. Step four: woh description wavefunction hai. Step five: Schrodinger equation woh rule hai jo govern karti hai ki wavefunction kaise evolve hoti hai. Har step zaroori hai, aur milkar yeh explain karte hain ki Schrodinger equation kyun exist karti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "A very common mistake beginners make is thinking that quantum mechanics says classical physics is wrong. It is not wrong — it is just limited. Classical physics is the right tool for large objects like cars, planets, and cricket balls. The double-slit experiment does not break Newton's laws for everyday objects. What it shows is that for tiny particles like electrons, a completely different framework is needed. The Schrodinger equation is that framework. Do not abandon classical physics — just understand where it applies and where quantum mechanics must take over.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Beginners ka ek bahut common mistake yeh sochna hai ki quantum mechanics kehti hai classical physics galat hai. Yeh galat nahi hai — sirf limited hai. Classical physics badi cheezoon jaise cars, planets, aur cricket balls ke liye sahi tool hai. Double-slit experiment everyday objects ke liye Newton's laws nahi todta. Jo yeh dikhata hai woh yeh hai ki tiny particles jaise electrons ke liye, ek bilkul alag framework ki zaroorat hai. Schrodinger equation woh framework hai. Classical physics mat chodo — bas samjho ki yeh kahan apply hoti hai aur kahan quantum mechanics ko over take karna padta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is the complete picture to keep in mind: classical physics gives exact paths for large objects, and it works brilliantly in that domain. But electrons and atoms behave like waves, not like tiny balls on paths. Experiments prove this beyond doubt. To describe wave-like particles mathematically, we use the wavefunction psi. The wavefunction does not tell us where the particle is — it tells us the probabilities of where it might be found. The Schrodinger equation is the rule that governs psi, the same way Newton's second law governs the motion of a ball. Once you understand this, the equation stops being mysterious and starts making complete sense.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Yeh complete picture dimag mein rakho: classical physics bade objects ke liye exact paths deti hai, aur woh us domain mein brilliantly kaam karti hai. Lekin electrons aur atoms waves ki tarah behave karte hain, na ki paths par tiny balls ki tarah. Experiments yeh beyond doubt prove karte hain. Wave-like particles ko mathematically describe karne ke liye hum wavefunction psi use karte hain. Wavefunction hume nahi batati particle kahan hai — yeh batati hai ki particle kahan mila ja sakta hai ki probabilities kya hain. Schrodinger equation woh rule hai jo psi govern karti hai, same way jaise Newton's second law ek ball ki motion govern karta hai. Jab tum yeh samjho, equation mysterious nahi lagti aur poori sense banaane lagti hai.",
                            },
                        ],
                        Examples: [
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "ElectronPattern",
                                ExampleContent:
                                    "When many electrons pass through a narrow opening, the final screen pattern can look wave-like instead of like a simple pile of tiny bullets. This is the double-slit result that classical physics cannot explain.",
                            },
                        ],
                        Hints: [
                            {
                                HintName: "DoNotSearchForOnlyOnePath",
                                HintContent:
                                    "Do not force the electron into a single fixed path. Think about possible results and their probabilities instead.",
                            },
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
                    },
                    Question: null,
                },
                {
                    TopicType: TOPIC_TYPES.QUIZ,
                    Title: "Quiz: Why We Need a Quantum Equation",
                    Description:
                        "Check your understanding of why the Schrodinger equation is needed.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["classical physics", "quantum", "electron", "wave behavior"],
                    SEO: {
                        Slug: "quiz-why-we-need-a-quantum-equation",
                        MetaTitle: "Quiz: Why We Need a Quantum Equation | KickBi",
                        MetaDescription: "Test your understanding of why the Schrodinger equation is needed. A quick beginner quiz on quantum mechanics basics.",
                        OgTitle: "Quiz: Why We Need a Quantum Equation | KickBi",
                        OgDescription: "Quick quiz on why quantum particles need a wave-based equation and what the Schrodinger equation does.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/quiz-why-we-need-a-quantum-equation",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Quiz", "name": "Quiz: Why We Need a Quantum Equation", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner" }),
                    },
                    Content: null,
                    Question: {
                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                        Question: "Why do we need the Schrodinger equation?",
                        Options: [
                            "To describe wave-like quantum behavior",
                            "To remove probability from physics",
                            "To make classical physics useless",
                            "To calculate only speed",
                        ],
                        Answer: "To describe wave-like quantum behavior",
                        AnswerDescription:
                            "The Schrodinger equation is needed because microscopic particles can show wave-like behavior that requires a wavefunction-based description. Classical physics has no way to capture this wave nature.",
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The correct answer is the first option. The equation exists because tiny particles show wave behavior that classical physics cannot describe.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Sahi answer pehla option hai. Equation isliye exist karti hai kyunki tiny particles wave behavior dikhate hain jise classical physics describe nahi kar sakti.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "We need the equation to describe wave-like behavior. An electron has a wavefunction, and the Schrodinger equation governs that wavefunction.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Equation ki need wave-like behavior describe karne ke liye hai. Electron ka wavefunction hota hai, aur Schrodinger equation us wavefunction ko govern karti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Option 1 is correct. Classical physics tracks exact paths. Quantum mechanics tracks wavefunctions and probabilities.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Option 1 sahi hai. Classical physics exact paths track karti hai. Quantum mechanics wavefunctions aur probabilities track karta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Option 3 is wrong: making classical physics useless is not the goal. The Schrodinger equation fills a gap that classical physics cannot cover at the atomic scale.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Option 3 galat hai: classical physics ko useless banana goal nahi hai. Schrodinger equation us gap ko fill karti hai jo classical physics atomic scale par cover nahi kar sakti.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The answer is to describe wave-like quantum behavior. The equation provides that description for small particles where classical paths break down.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Answer hai wave-like quantum behavior describe karna. Equation small particles ke liye woh description provide karti hai jahan classical paths kaam nahi karte.",
                            },
                        ],
                    },
                },
                {
                    TopicType: TOPIC_TYPES.THEORY,
                    Title: "Matter Waves and the Wavefunction",
                    Description:
                        "A student-friendly explanation of matter waves and what the wavefunction is trying to describe.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["matter waves", "de Broglie", "wavefunction", "psi", "probability"],
                    SEO: {
                        Slug: "matter-waves-and-the-wavefunction",
                        MetaTitle: "Matter Waves and the Wavefunction | Schrodinger Equation | KickBi",
                        MetaDescription: "Learn what matter waves are and how the wavefunction psi describes the quantum state of a particle. Beginner-friendly with clear examples.",
                        OgTitle: "Matter Waves and the Wavefunction | KickBi",
                        OgDescription: "Understand de Broglie matter waves and the wavefunction psi. Learn how psi stores quantum information and leads to probability density.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/matter-waves-and-the-wavefunction",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Matter Waves and the Wavefunction", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner", "learningResourceType": "Lesson" }),
                    },
                    Content: {
                        RawContent: `[H:H2] De Broglie's Radical Idea: All Matter Has Wave-Like Behavior [/H:H2]

[P] In 1924, a French physicist named [B] Louis de Broglie [/B] made a bold proposal. We already knew that light — which behaves as a wave — can also behave as a particle (the photon). De Broglie asked: what if particles of matter, like electrons, also behave as waves? [/P]

[P] This idea seemed radical. But experiments confirmed it. Electrons, neutrons, and even large molecules can produce interference and diffraction patterns — behaviors that only waves can produce. The wavelength of a matter wave is given by [B] de Broglie's relation [/B]: [MATH] \lambda = h / p [/MATH], where [CODE] h [/CODE] is Planck's constant and [CODE] p [/CODE] is the particle's momentum. [/P]

[P] For a cricket ball, this wavelength is so incredibly tiny that it is completely undetectable. For an electron moving at moderate speed, the wavelength is comparable to atomic distances — large enough to cause real, measurable interference effects. This is why quantum wave behavior is only visible at small scales. [/P]

[H:H2] Introducing the Wavefunction: Psi (ψ) [/H:H2]

[P] De Broglie's matter wave tells us that a particle needs a wave-based mathematical description. That description is the [B] wavefunction [/B], written with the Greek letter [B] psi (ψ) [/B]. The wavefunction is a function that has a value at every point in space and at every moment in time. [/P]

[P] Psi is [B] not [/B] a physical wave you can see or touch. It is a mathematical object — a complete information package. Everything quantum mechanics can know about a particle is encoded in its wavefunction. Think of psi as the quantum state description, not a path or a trajectory. [/P]

[HINT:PsiIsInformation]

[H:H2] From Psi to Probability Density [/H:H2]

[P] Psi itself is not directly measurable. You cannot put a detector in the lab and directly read off the value of psi. But psi is intimately connected to a quantity that [B] IS [/B] measurable: [B] probability density [/B]. [/P]

[P] The probability density at any location is given by the square of the magnitude of psi: [MATH] P(x) = |\psi(x)|^2 [/MATH]. A region where [MATH] |\psi|^2 [/MATH] is large means the particle is very likely to be detected there. A region where [MATH] |\psi|^2 [/MATH] is small means the particle is rarely found there. [/P]

[EXAMPLE:PerfumeSpread]

[ASSET:MatterWaveCard]

[H:H2] Why This Is Different from Classical Physics [/H:H2]

[P] In classical physics, a particle has a definite position at every moment. In quantum mechanics, before a measurement is made, the particle does not have a definite position — it has a [B] wavefunction [/B]. The wavefunction encodes the probabilities of all possible measurement outcomes. After a measurement, we know where the particle was found — but until then, only probabilities exist. [/P]

[H:H2] The Connection to the Schrodinger Equation [/H:H2]

[P] The wavefunction is the central object that the Schrodinger equation governs. The equation is the rule that tells us how [B] ψ [/B] changes with time, given the forces acting on the particle. Once we can track how ψ evolves, we can calculate probabilities for any measurement at any future time. [/P]`,
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "De Broglie asked a genuinely brilliant question: if light — which we know as a wave — can behave like a particle, then can a particle like an electron behave like a wave? The answer turned out to be yes. Electrons passing through narrow slits produce interference patterns, exactly like water waves do. This is matter wave behavior, and it tells us that we need a wave-based description for particles. That description is the wavefunction psi. Psi is not a path that you trace from start to finish. It is a spread of quantum information — and the Schrodinger equation is what tells us how that information evolves over time.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "De Broglie ne ek genuinely brilliant question poocha: agar light — jise hum ek wave ke roop mein jaante hain — particle ki tarah behave kar sakti hai, to kya electron jaise particle wave ki tarah behave kar sakta hai? Jawab haan nikla. Narrow slits se guzrte hue electrons interference patterns banate hain, exactly water waves ki tarah. Yeh matter wave behavior hai, aur yeh hume batata hai ki particles ke liye hume ek wave-based description chahiye. Woh description wavefunction psi hai. Psi koi path nahi hai jise tum start se end tak trace karo. Yeh quantum information ka ek spread hai — aur Schrodinger equation woh hai jo batati hai ki yeh information time ke saath kaise evolve hoti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is a helpful analogy. Imagine the surface of a pond after you drop a stone. Ripples spread out in all directions, and where two sets of ripples meet, they either add up into a bigger wave or cancel each other out. Now, think of the wavefunction psi as a description of similar ripples in a quantum system. Where psi is large, the probability of finding the particle is high. Where psi is small, the probability is low. The wavefunction spreads out like a wave, and when it is squared — giving |ψ|² — it tells us the probability of finding the particle in each region. This is the core of what matter waves mean.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Yahan ek helpful analogy hai. Socho pond ki surface par ek patthar daalne ke baad. Ripples sab directions mein spread hoti hain, aur jahan do groups of ripples milti hain, woh ya to ek badi wave mein add ho jaati hain ya cancel ho jaati hain. Ab wavefunction psi ko ek quantum system mein similar ripples ki description ki tarah socho. Jahan psi badi hai, particle milne ki probability high hai. Jahan psi chhoti hai, probability low hai. Wavefunction ek wave ki tarah spread hoti hai, aur jab ise square kiya jaata hai — |ψ|² deta hai — toh yeh batata hai ki particle har region mein milne ki probability kya hai. Yahi matter waves ka core meaning hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me connect matter waves to the wavefunction step by step. Step one: every moving particle has a matter wave associated with it, with wavelength given by λ = h/p. Step two: to describe this wave mathematically, we introduce the wavefunction psi, which is a complex-valued function of position and time. Step three: psi itself is not directly measurable in a lab — you cannot read off its value with a detector. Step four: the quantity that IS measurable is |ψ|², the square of the magnitude of psi. This is the probability density — it tells you how likely you are to find the particle in any given region. Step five: because the particle must exist somewhere, the integral of |ψ|² over all space must equal exactly one. That is the normalization condition.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main matter waves ko wavefunction se step by step connect karta hoon. Step one: har moving particle ke saath ek matter wave associated hoti hai, jiska wavelength λ = h/p se diya jaata hai. Step two: is wave ko mathematically describe karne ke liye hum wavefunction psi introduce karte hain, jo position aur time ka complex-valued function hai. Step three: psi khud lab mein directly measurable nahi hai — tum ek detector se uski value nahi pad sakte. Step four: jo quantity measurable hai woh |ψ|² hai, psi ke magnitude ka square. Yeh probability density hai — yeh batata hai ki tum kisi bhi given region mein particle kitni likely jagah paoge. Step five: kyunki particle kahin na kahin exist karta hai, sari space par |ψ|² ka integral exactly ek ke barabar hona chahiye. Yeh normalization condition hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me address two mistakes that students often make here. The first mistake is thinking that matter waves are physical waves like water waves — visible ripples that travel through space. They are not. Matter waves are mathematical descriptions encoded in the wavefunction. You cannot see an electron's matter wave in the lab. The second mistake is calling psi the probability directly. Psi is the probability amplitude. The actual probability density is |ψ|² — the square of the magnitude. These two quantities are different, and confusing them will cause errors in every calculation you attempt.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main yahan do mistakes address karta hoon jo students aksar karte hain. Pehli mistake yeh sochna hai ki matter waves physical waves hain jaise water waves — visible ripples jo space mein travel karti hain. Aisa nahi hai. Matter waves mathematical descriptions hain jo wavefunction mein encoded hain. Tum lab mein electron ki matter wave nahi dekh sakte. Doosri mistake psi ko directly probability kehna hai. Psi probability amplitude hai. Actual probability density |ψ|² hai — magnitude ka square. Yeh do quantities alag hain, aur inhe confuse karna har calculation mein errors create karega.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me give you the complete summary. De Broglie proposed that moving particles have wave-like behavior — this is the matter wave idea. To describe this mathematically, we use the wavefunction psi, which is a complex function of position and time. Psi stores the complete quantum state of the particle. To connect psi to something measurable, we compute |ψ|² — the probability density — which tells us how likely we are to detect the particle at each point in space. The Schrodinger equation is the rule that tells us how psi changes. Master these ideas and the rest of quantum mechanics will follow naturally.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe complete summary deta hoon. De Broglie ne propose kiya ki moving particles mein wave-like behavior hota hai — yeh matter wave idea hai. Ise mathematically describe karne ke liye hum wavefunction psi use karte hain, jo position aur time ka complex function hai. Psi particle ki complete quantum state store karti hai. Psi ko kuch measurable se connect karne ke liye hum |ψ|² compute karte hain — probability density — jo batata hai ki hum space mein har point par particle detect karne ki kitni likely jagah hain. Schrodinger equation woh rule hai jo batati hai ki psi kaise change hoti hai. In ideas ko master karo aur baaki quantum mechanics naturally follow karegi.",
                            },
                        ],
                        Examples: [
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "PerfumeSpread",
                                ExampleContent:
                                    "Perfume in a room does not stay at one point. It spreads. This is not exactly a quantum wave, but it helps imagine why a spread-out description can be useful rather than a single fixed point.",
                            },
                        ],
                        Hints: [
                            {
                                HintName: "PsiIsInformation",
                                HintContent:
                                    "Treat psi as information about the quantum state, not as a visible water wave that you can see moving.",
                            },
                        ],
                        Asset: {
                            Type: ASSET_TYPES.IMAGE,
                            AssetName: "MatterWaveCard",
                            FileName: "topic-03-matter-wave-card.svg",
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
                    },
                    Question: null,
                },
                {
                    TopicType: TOPIC_TYPES.QUIZ,
                    Title: "Quiz: Matter Waves and the Wavefunction",
                    Description:
                        "Check your understanding of matter waves and what the wavefunction represents.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["wavefunction", "psi", "matter waves"],
                    SEO: {
                        Slug: "quiz-matter-waves-and-the-wavefunction",
                        MetaTitle: "Quiz: Matter Waves and the Wavefunction | KickBi",
                        MetaDescription: "Test your understanding of matter waves and what the wavefunction psi represents in quantum mechanics.",
                        OgTitle: "Quiz: Matter Waves and the Wavefunction | KickBi",
                        OgDescription: "Quick quiz on de Broglie matter waves and the wavefunction psi in quantum mechanics.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/quiz-matter-waves-and-the-wavefunction",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Quiz", "name": "Quiz: Matter Waves and the Wavefunction", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner" }),
                    },
                    Content: null,
                    Question: {
                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                        Question: "What is the wavefunction mainly used for?",
                        Options: [
                            "To describe the quantum state and calculate probabilities",
                            "To show a fixed classical path",
                            "To remove wave behavior",
                            "To make all energies equal",
                        ],
                        Answer: "To describe the quantum state and calculate probabilities",
                        AnswerDescription:
                            "The wavefunction psi describes the full quantum state of a particle. Its squared magnitude gives probability density, which tells us how likely we are to find the particle at each location.",
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The wavefunction is a quantum state description. It does not show a path. It gives probabilities.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Wavefunction quantum state description hai. Yeh path nahi dikhata. Yeh probabilities deta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Psi is not about fixed paths. It describes a quantum state from which we can calculate the probability of each measurement result.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Psi fixed paths ke baare mein nahi hai. Yeh quantum state describe karta hai jisse hum har measurement result ki probability calculate kar sakte hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The wavefunction replaces the path idea with a probabilistic description.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Wavefunction path idea ko probabilistic description se replace karta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Option 2 is a common wrong answer. Psi moves away from the path picture to the probability picture.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Option 2 common galat answer hai. Psi path picture se probability picture ki taraf move karta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The wavefunction stores quantum information, and its squared magnitude gives probability density.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Wavefunction quantum information store karta hai, aur uske squared magnitude se probability density milti hai.",
                            },
                        ],
                    },
                },
                {
                    TopicType: TOPIC_TYPES.THEORY,
                    Title: "Psi and Probability Density",
                    Description:
                        "A simple explanation of psi and why the square of its magnitude matters.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["wavefunction", "psi", "probability density", "normalization"],
                    SEO: {
                        Slug: "psi-and-probability-density",
                        MetaTitle: "Psi and Probability Density | Schrodinger Equation | KickBi",
                        MetaDescription: "Understand how the wavefunction psi connects to probability density. Learn why we square the magnitude and what normalization means in quantum mechanics.",
                        OgTitle: "Psi and Probability Density | KickBi",
                        OgDescription: "Learn why squaring the magnitude of psi gives probability density and how normalization works in quantum mechanics.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/psi-and-probability-density",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Psi and Probability Density", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner", "learningResourceType": "Lesson" }),
                    },
                    Content: {
                        RawContent: `[H:H2] What Is Psi — Really? [/H:H2]

[P] The wavefunction [B] ψ (psi) [/B] is a function of position and time. It is generally a [B] complex-valued [/B] function, meaning it can have both a real part and an imaginary part. This is not a problem — complex numbers are simply a mathematical tool. What we can directly observe is always a real number, and we extract that in the next step. [/P]

[P] Psi has a value at every point in space. It can be large in some regions, small in others, positive, negative, or imaginary. But psi itself is [B] never directly observed [/B] in a lab. You cannot point a detector at a particle and read off the value of psi. Psi lives in the mathematical description of the quantum state. [/P]

[HINT:SquareBeforeProbability]

[H:H2] The Bridge to Measurement: |ψ|² [/H:H2]

[P] To extract a physically meaningful, measurable quantity from psi, we compute the [B] probability density [/B]: [/P]

[P] [MATH] P(x) = |\psi(x)|^2 [/MATH] [/P]

[P] The vertical bars mean we take the [B] magnitude [/B] (or modulus) of the complex number ψ and then square it. This step is crucial because: [/P]

[UL]
[LI] The magnitude of a complex number is always real and non-negative [/LI]
[LI] Squaring makes the result non-negative — a requirement for any probability [/LI]
[LI] The result [MATH] |\psi(x)|^2 [/MATH] gives the probability per unit length of finding the particle near position [CODE] x [/CODE] [/LI]
[/UL]

[P] Where [MATH] |\psi|^2 [/MATH] is [B] large [/B], the particle is very likely to be found. Where [MATH] |\psi|^2 [/MATH] is [B] small [/B], the particle is rarely found. Where [MATH] |\psi|^2 [/MATH] is [B] zero [/B], the particle is never found at that location. [/P]

[EXAMPLE:BrightRoomAnalogy]

[H:H2] Normalization: The Total Probability Must Be One [/H:H2]

[P] The particle exists somewhere — it cannot simply vanish. This means if we add up the probability density over all of space, the result must be exactly 1. This condition is called [B] normalization [/B]: [/P]

[P] [MATH] \int |\psi(x)|^2 \, dx = 1 [/MATH] [/P]

[P] A wavefunction that satisfies this condition is called [B] normalized [/B]. If you solve the Schrodinger equation and the solution does not automatically satisfy this, you multiply psi by a constant to scale it until the integral equals 1. A non-normalized wavefunction cannot represent a physical state until it is properly scaled. [/P]

[ASSET:ProbabilityDensityCard]

[H:H2] The Key Distinction: ψ versus |ψ|² [/H:H2]

[P] Many beginners confuse these two quantities. Here is the difference: [/P]

[UL]
[LI] [B] ψ [/B] is the wavefunction — a probability amplitude. It can be complex, negative, or imaginary. [/LI]
[LI] [B] |ψ|² [/B] is the probability density — always real and non-negative. This is what connects to measurement. [/LI]
[/UL]

[P] You can think of psi as the raw quantum information, and [MATH] |\psi|^2 [/MATH] as the translation of that information into a measurable prediction. [/P]

[H:H2] Where Does Psi Come From? [/H:H2]

[P] You do not guess psi. You [B] calculate [/B] it by solving the Schrodinger equation for the specific system you are studying. For each physical setup — an electron in a box, an electron near a nucleus, a particle in a potential well — the equation has its own set of valid wavefunctions. Each valid wavefunction corresponds to a definite energy level and a specific probability distribution over space. [/P]`,
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is the key insight about psi and probability that I want you to really understand. Psi is not the probability. Psi is something deeper — it is called the probability amplitude. To get the actual probability density, you must square the magnitude of psi, giving you |ψ|². Why the extra step? Because psi is a complex number — it can be negative or imaginary — and probabilities must always be real and non-negative. Squaring the magnitude always produces a real, non-negative result. So the rule is: psi describes the quantum state, |ψ|² gives the probability density. Never confuse the two.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Yahan psi aur probability ke baare mein key insight hai jo main chahta hoon tum sach mein samjho. Psi probability nahi hai. Psi kuch deeper hai — ise probability amplitude kehte hain. Actual probability density paane ke liye, tumhe psi ke magnitude ka square karna padta hai, |ψ|² milta hai. Extra step kyun? Kyunki psi ek complex number hai — yeh negative ya imaginary ho sakta hai — aur probabilities hamesha real aur non-negative honi chahiye. Magnitude ko square karna hamesha ek real, non-negative result deta hai. Toh rule yeh hai: psi quantum state describe karta hai, |ψ|² probability density deta hai. Dono ko kabhi confuse mat karo.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me give you an analogy for |ψ|² that makes it very tangible. Imagine a room where the lighting is not even — some areas are brightly lit and others are dim. If you were to search for a small object randomly placed in the room, you would be much more likely to spot it in the brighter areas. The brightness at each location corresponds to |ψ|². Bright regions mean high probability of finding the particle there. Dim regions mean low probability. Completely dark spots mean the particle is never found there. Psi is what generates the brightness pattern — but it is the brightness itself, |ψ|², that you can actually measure by running many experiments.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe |ψ|² ke liye ek analogy deta hoon jo ise bahut tangible bana deta hai. Ek room imagine karo jahan lighting even nahi hai — kuch areas brightly lit hain aur kuch dim hain. Agar tum randomly rakhi ek chhoti object dhoondh rahe ho room mein, to tum use bright areas mein zyada likely spot karoge. Har location par brightness |ψ|² se correspond karti hai. Bright regions matlab wahan particle milne ki high probability. Dim regions matlab low probability. Completely dark spots matlab particle wahan kabhi nahi milta. Psi woh hai jo brightness pattern generate karta hai — lekin brightness khud, |ψ|², woh hai jo tum actually bahut saare experiments run karke measure kar sakte ho.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me walk you through the precise steps from psi to a prediction. Step one: solve the Schrodinger equation for your system to obtain psi as a function of position. Step two: to find the probability density at any position x, compute |ψ(x)|² by taking the complex conjugate of psi, multiplying psi by it, and the result is always real and non-negative. Step three: to find the actual probability of detecting the particle in a small region between x and x+dx, multiply |ψ(x)|² by dx. Step four: integrate |ψ(x)|² over any region to get the probability of finding the particle in that entire region. Step five: to check normalization, integrate |ψ(x)|² over all of space — the result must equal exactly 1. These steps take you from a mathematical function to a real experimental prediction.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe psi se prediction tak precise steps walk-through karta hoon. Step one: apne system ke liye Schrodinger equation solve karo taaki psi position ka function ke roop mein mile. Step two: kisi bhi position x par probability density find karne ke liye, |ψ(x)|² compute karo psi ka complex conjugate lekar, use psi se multiply karo, aur result hamesha real aur non-negative hoga. Step three: ek chhoti region x aur x+dx ke beech mein particle detect karne ki actual probability find karne ke liye, |ψ(x)|² ko dx se multiply karo. Step four: kisi bhi region mein |ψ(x)|² integrate karo taaki us poori region mein particle milne ki probability mile. Step five: normalization check karne ke liye, |ψ(x)|² ko sari space par integrate karo — result exactly 1 hona chahiye. Yeh steps ek mathematical function se real experimental prediction tak le jaate hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "I want to address a mistake that causes confusion at exactly this point. Students often say 'psi is the probability of finding the particle here.' That is wrong, and it will lead to errors. The correct statement is: |ψ|² is the probability density. The difference matters because psi can be negative and complex. For example, in some systems, psi is negative in certain regions. If psi were the probability, a negative probability would make no sense. But |ψ|² is always non-negative, so it can be interpreted as a probability density. Also remember: normalization is not optional. A wavefunction must be normalized before it represents a physical state.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main ek mistake address karna chahta hoon jo exactly is point par confusion create karti hai. Students aksar kehte hain 'psi particle yahan milne ki probability hai.' Yeh galat hai, aur yeh errors lead karega. Sahi statement hai: |ψ|² probability density hai. Difference matter karta hai kyunki psi negative aur complex ho sakta hai. For example, kuch systems mein, psi kuch regions mein negative hoti hai. Agar psi probability hoti, to negative probability ka koi sense nahi banta. Lekin |ψ|² hamesha non-negative hai, isliye ise probability density ki tarah interpret kiya ja sakta hai. Yeh bhi yaad rakho: normalization optional nahi hai. Wavefunction ko physical state represent karne se pehle normalize kiya jaana chahiye.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is the complete summary of this topic. Psi is the wavefunction — a complex-valued function that describes the complete quantum state of a particle. Psi is not directly observable; it is the mathematical description living behind the scenes. The quantity |ψ|² is the probability density — the square of the magnitude of psi — and this IS measurable, through the statistics of many repeated experiments. For the wavefunction to be physically valid, it must be normalized: the integral of |ψ|² over all space must equal exactly one. These three ideas together — psi describes the state, |ψ|² gives probability, normalization ensures consistency — are the foundation of everything in quantum mechanics.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Is topic ka complete summary yeh hai. Psi wavefunction hai — ek complex-valued function jo particle ki complete quantum state describe karti hai. Psi directly observable nahi hai; yeh mathematical description hai jo scenes ke peeche rehti hai. |ψ|² probability density hai — psi ke magnitude ka square — aur yeh IS measurable hai, bahut baar repeated experiments ki statistics ke through. Wavefunction physically valid hone ke liye, ise normalize hona chahiye: sari space par |ψ|² ka integral exactly ek ke barabar hona chahiye. Yeh teen ideas milkar — psi state describe karti hai, |ψ|² probability deta hai, normalization consistency ensure karti hai — quantum mechanics mein har cheez ki foundation hain.",
                            },
                        ],
                        Examples: [
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "BrightRoomAnalogy",
                                ExampleContent:
                                    "Imagine a room with brighter and darker areas. A brighter area represents larger probability density, so the particle is more likely to be found in the brighter region than in the darker one.",
                            },
                        ],
                        Hints: [
                            {
                                HintName: "SquareBeforeProbability",
                                HintContent:
                                    "First take the magnitude of psi, then square it. Only after that step can you talk about probability density.",
                            },
                        ],
                        Asset: {
                            Type: ASSET_TYPES.IMAGE,
                            AssetName: "ProbabilityDensityCard",
                            FileName: "topic-05-probability-density-card.svg",
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
                    },
                    Question: null,
                },
                {
                    TopicType: TOPIC_TYPES.QUIZ,
                    Title: "Quiz: Psi and Probability Density",
                    Description: "Check your understanding of how psi connects to probability.",
                    DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                    Keywords: ["psi", "probability density", "normalization"],
                    SEO: {
                        Slug: "quiz-psi-and-probability-density",
                        MetaTitle: "Quiz: Psi and Probability Density | KickBi",
                        MetaDescription: "Test your knowledge of psi, probability density, and normalization in quantum mechanics.",
                        OgTitle: "Quiz: Psi and Probability Density | KickBi",
                        OgDescription: "Quick quiz on psi and probability density in quantum mechanics.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/quiz-psi-and-probability-density",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Quiz", "name": "Quiz: Psi and Probability Density", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Beginner" }),
                    },
                    Content: null,
                    Question: {
                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                        Question: "What gives probability density in quantum mechanics?",
                        Options: [
                            "The square of the magnitude of psi",
                            "Psi without any operation",
                            "Only the particle speed",
                            "Only the particle mass",
                        ],
                        Answer: "The square of the magnitude of psi",
                        AnswerDescription:
                            "Probability density is obtained by taking the square of the magnitude of the wavefunction psi. Psi itself is a probability amplitude and cannot be used directly as a probability.",
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The answer is the square of the magnitude of psi. Psi is just the amplitude. Squaring its magnitude turns it into a real, positive probability density.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Answer psi ke magnitude ka square hai. Psi sirf amplitude hai. Uske magnitude ko square karne se real, positive probability density milti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Step 1: take the magnitude of psi. Step 2: square it. The result is probability density.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Step 1: psi ka magnitude lo. Step 2: use square karo. Result probability density hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Option 2 says psi without any operation. Psi can be complex, so it cannot be directly a probability. You must square its magnitude first.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Option 2 kehta hai psi bina kisi operation ke. Psi complex ho sakta hai, isliye directly probability nahi ho sakta.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Speed and mass have nothing to do with probability density here. The wavefunction psi contains all the quantum information.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Speed aur mass ka probability density se koi lena dena nahi hai yahan. Wavefunction psi mein saari quantum information hoti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Probability density is the square of the magnitude of psi. This is the most fundamental rule connecting the wavefunction to what we can actually measure.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Probability density psi ke magnitude ka square hai. Yeh woh sabse fundamental rule hai jo wavefunction ko actual measurement se connect karta hai.",
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
            SEO: {
                Slug: "using-the-equation",
                MetaTitle: "Using the Equation \u2013 Schrodinger Equation Chapter 2 | KickBi",
                MetaDescription: "Apply the Schrodinger equation to real problems. Learn particle in a box, boundary conditions, and quantum tunneling. Intermediate-level chapter.",
                OgTitle: "Using the Equation | Schrodinger Equation | KickBi",
                OgDescription: "Practical applications of the Schrodinger equation. Covers particle in a box, boundary conditions, and tunneling in clear terms.",
                CanonicalUrl: "/courses/schrodinger-equation/chapters/using-the-equation",
                JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Using the Equation", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Intermediate", "learningResourceType": "Chapter" }),
            },
            AIExplanationVersions: [
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "This chapter moves from meaning to use. Now that the wavefunction idea is clear, we can see how the equation helps solve real quantum problems.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Yeh chapter meaning se use ki taraf move karta hai. Ab wavefunction ka idea clear hai, to hum dekh sakte hain equation real quantum problems solve karne mein kaise help karti hai.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "We will focus on standard student examples, because examples make the equation feel less abstract.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Hum standard student examples par focus karenge, kyunki examples equation ko kam abstract feel karwate hain.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "The chapter introduces stationary states, allowed energies, the particle in a box, and tunneling.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Yeh chapter stationary states, allowed energies, particle in a box, aur tunneling introduce karta hai.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "The main idea is that boundary conditions and the wavefunction shape decide which states are physically allowed.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Main idea yeh hai ki boundary conditions aur wavefunction shape decide karte hain kaun se states physically allowed hain.",
                },
                {
                    [LANGUAGES_SUPPORTED.ENGLISH]:
                        "By the end of this chapter, students should see the Schrodinger equation as a practical method, not just a symbolic statement.",
                    [LANGUAGES_SUPPORTED.HINGLISH]:
                        "Is chapter ke end tak students ko Schrodinger equation practical method jaisi lagni chahiye, sirf symbolic statement jaisi nahi.",
                },
            ],
            Topics: [
                {
                    TopicType: TOPIC_TYPES.THEORY,
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
                    SEO: {
                        Slug: "time-independent-equation-and-boundaries",
                        MetaTitle: "Time-Independent Schrodinger Equation & Boundaries | KickBi",
                        MetaDescription: "Learn how the time-independent Schrodinger equation and boundary conditions determine allowed wavefunctions and quantized energy levels.",
                        OgTitle: "Time-Independent Equation and Boundaries | KickBi",
                        OgDescription: "How stable potentials and boundary conditions create allowed wavefunctions and quantized energy levels in quantum mechanics.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/time-independent-equation-and-boundaries",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Time-Independent Equation and Boundaries", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Intermediate", "learningResourceType": "Lesson" }),
                    },
                    Content: {
                        RawContent: `[H:H2] The Full Equation and Its Simplified Form [/H:H2]

[P] The Schrodinger equation in its general form describes how the wavefunction changes with time. But many of the most important physical systems have a potential energy [CODE] V [/CODE] that does not change with time — the electric field near an atomic nucleus, the walls of a quantum box, the force from a spring. For these stable systems, we use a streamlined version called the [B] time-independent Schrodinger equation (TISE) [/B]: [/P]

[P] [MATH] -\frac{\hbar^2}{2m} \frac{d^2\psi}{dx^2} + V(x)\psi = E\psi [/MATH] [/P]

[P] Here: [CODE] ψ [/CODE] is the wavefunction as a function of position, [CODE] V(x) [/CODE] is the potential energy, [CODE] E [/CODE] is the total energy of the state, [CODE] ℏ [/CODE] is the reduced Planck constant, and [CODE] m [/CODE] is the mass of the particle. [/P]

[P] This equation asks: given this potential [CODE] V(x) [/CODE], which wavefunction shapes ψ are physically allowed, and what energy [CODE] E [/CODE] does each allowed shape carry? [/P]

[HINT:CheckTheBoundaries]

[H:H2] Stationary States: The Stable Solutions [/H:H2]

[P] The solutions to the TISE are called [B] stationary states [/B]. In a stationary state, the probability density [MATH] |\psi|^2 [/MATH] does not change with time — the particle's position probabilities stay constant. The energy is definite and fixed. [/P]

[P] Not every mathematical function qualifies as a stationary state. Only wavefunctions that simultaneously [B] satisfy the differential equation [/B], [B] satisfy the physical boundary conditions [/B], and [B] can be normalized [/B] are genuine physical solutions. [/P]

[EXAMPLE:StringFixedAtEnds]

[H:H2] Boundary Conditions: The Physical Filter [/H:H2]

[P] Boundary conditions are the physical constraints that ψ must satisfy at the edges or walls of the system. The two most common cases are: [/P]

[UL]
[LI] [B] At a rigid wall (infinite potential): [/B] the particle cannot exist inside the wall, so ψ must equal zero at that boundary. The wavefunction must vanish continuously — it cannot jump abruptly. [/LI]
[LI] [B] At infinity: [/B] far from a potential well, the particle should not exist. So ψ must decay to zero as position approaches ±∞. A wavefunction that grows without bound at infinity is not physical. [/LI]
[/UL]

[EXAMPLE:DiscreteEnergyLevels]

[H:H2] How Boundary Conditions Create Quantized Energies [/H:H2]

[P] Here is the essential chain of reasoning: [/P]

[OL]
[LI] The TISE has infinitely many mathematical solutions for any value of [CODE] E [/CODE]. [/LI]
[LI] Boundary conditions eliminate all solutions that do not satisfy the physical constraints. [/LI]
[LI] Only certain wave shapes survive this filtering. [/LI]
[LI] Each surviving wave shape corresponds to one specific value of [CODE] E [/CODE]. [/LI]
[LI] Therefore, only a discrete set of energy values is physically allowed. [/LI]
[/OL]

[ASSET:BoundaryEnergyCard]

[P] This is the quantum origin of quantized energy. It does not come from an arbitrary assumption — it emerges naturally from the mathematics of the equation combined with the physical boundary conditions of the system. [/P]`,
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The time-independent Schrodinger equation is what you use when you want to find the stable, long-lived energy states of a quantum system. Think of it this way: instead of asking how the wavefunction changes from moment to moment, we ask what wavefunction shapes are possible when the system has settled into a definite energy. The equation gives us those shapes — but not all shapes are physically real. Boundary conditions act as a filter. They impose the physical requirements that ψ must satisfy at the walls or edges of the system. Only the wavefunction shapes that pass this filter are real states, and each real state comes with a specific, fixed energy. This is where quantized energy levels come from.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Time-independent Schrodinger equation woh hai jo tum tab use karte ho jab ek quantum system ki stable, long-lived energy states find karni hoti hain. Is tarah socho: is waqt yeh nahi poochh rahe ki wavefunction har moment kaise change hoti hai, hum pooch rahe hain ki kaun si wavefunction shapes possible hain jab system ek definite energy mein settle ho jata hai. Equation humein woh shapes deti hai — lekin saari shapes physically real nahi hoti. Boundary conditions ek filter ki tarah kaam karti hain. Woh physical requirements impose karti hain jo ψ ko system ki walls ya edges par satisfy karni padti hain. Sirf wahi wavefunction shapes real states hain jo is filter se pass hoti hain, aur har real state ek specific, fixed energy ke saath aati hai. Yahan se quantized energy levels aate hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is the best analogy I know for understanding boundary conditions. Think of a guitar string fixed firmly at both ends. When you pluck it, it vibrates — but not in every conceivable shape. It can only produce standing waves that fit perfectly between the two fixed endpoints. One arch, two arches, three arches, and so on. Each of those patterns has a specific frequency and musical note. Now, a quantum wavefunction in a bounded region works exactly the same way. The boundary conditions are the fixed endpoints. The wavefunction must fit between them. Only certain wave shapes fit. Each fitting shape carries a specific energy. This is energy quantization, and it is not an assumption — it falls out of the mathematics.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Yahan boundary conditions samajhne ke liye sabse achhi analogy hai. Socho ek guitar string dono ends par firmly fixed hai. Jab tum ise pluck karte ho, yeh vibrate karti hai — lekin har conceivable shape mein nahi. Yeh sirf woh standing waves produce kar sakti hai jo dono fixed endpoints ke beech perfectly fit hoti hain. Ek arch, do arches, teen arches, aur aage. Un patterns mein se har ek ki specific frequency aur musical note hoti hai. Ab, ek bounded region mein ek quantum wavefunction exactly same tarah kaam karti hai. Boundary conditions fixed endpoints hain. Wavefunction ko unke beech fit hona padta hai. Sirf kuch wave shapes fit hoti hain. Har fitting shape ek specific energy carry karti hai. Yeh energy quantization hai, aur yeh koi assumption nahi hai — yeh mathematics se naturally nikalti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me show you the complete workflow for solving a quantum problem with the time-independent Schrodinger equation. Step one: identify the potential V(x) for the system. Step two: write the TISE and substitute that V(x). Step three: solve the differential equation — this gives a family of mathematical solutions, one for each possible value of E. Step four: apply the boundary conditions. For a rigid box, this means ψ must be zero at both walls. Step five: only the solutions that satisfy the boundary conditions survive. Each surviving solution is a physical wavefunction, and it corresponds to one specific energy value. Step six: normalize each surviving wavefunction. You now have the complete set of physical states and their energies. This workflow applies to every bounded quantum system you will ever study.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe time-independent Schrodinger equation ke saath ek quantum problem solve karne ka complete workflow dikhata hoon. Step one: system ke liye potential V(x) identify karo. Step two: TISE likho aur woh V(x) substitute karo. Step three: differential equation solve karo — yeh mathematical solutions ki ek family deta hai, E ki har possible value ke liye ek. Step four: boundary conditions apply karo. Ek rigid box ke liye, iska matlab hai ψ dono walls par zero honi chahiye. Step five: sirf woh solutions survive karte hain jo boundary conditions satisfy karte hain. Har surviving solution ek physical wavefunction hai, aur woh ek specific energy value se correspond karta hai. Step six: har surviving wavefunction normalize karo. Tumhare paas ab physical states ka complete set aur unki energies hain. Yeh workflow har bounded quantum system par apply hota hai jise tum kabhi bhi study karoge.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is a mistake that I see students make very often. They solve the Schrodinger equation and find a set of mathematical solutions, and then they stop — without checking whether those solutions actually satisfy the boundary conditions. This is wrong. Every mathematical solution satisfies the equation, but most do not satisfy the physical constraints of the system. The boundary conditions are what separate the mathematically valid from the physically real. Another related mistake is thinking that any energy E is allowed. In a bounded system, this is not true. The boundary conditions force E to take only specific discrete values. If you pick an energy that is not in that discrete set, there is no physical wavefunction that goes with it. You will just get a mathematical function that is not normalizable or that does not vanish at the walls.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Yahan ek mistake hai jo main bahut baar students ko karte dekh ta hoon. Woh Schrodinger equation solve karte hain aur mathematical solutions ka ek set find karte hain, aur phir ruk jaate hain — yeh check kiye bina ki woh solutions actually boundary conditions satisfy karte hain ya nahi. Yeh galat hai. Har mathematical solution equation satisfy karta hai, lekin zyaadatar system ki physical constraints satisfy nahi karte. Boundary conditions woh hain jo mathematically valid ko physically real se alag karti hain. Ek aur related mistake yeh sochna hai ki koi bhi energy E allowed hai. Ek bounded system mein, yeh sach nahi hai. Boundary conditions E ko sirf specific discrete values lene par force karti hain. Agar tum ek aisi energy chunte ho jo us discrete set mein nahi hai, to koi physical wavefunction nahi hai jo uske saath jaati ho. Tum sirf ek mathematical function paoge jo normalizable nahi hai ya walls par zero nahi hoti.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Here is the complete picture for this topic. When potential energy does not vary with time, we use the time-independent Schrodinger equation to find stationary states. A stationary state is a wavefunction whose probability density does not change with time — it is a stable configuration of the quantum system. Not every mathematical solution is physical. Boundary conditions filter out invalid solutions by requiring the wavefunction to behave correctly at the edges of the system — zero at rigid walls, decaying to zero at infinity. Only the wavefunction shapes that satisfy these conditions are real. Each real shape corresponds to one specific energy. This is how quantized energy levels emerge naturally from the Schrodinger equation.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Is topic ka complete picture yeh hai. Jab potential energy time ke saath vary nahi karti, hum time-independent Schrodinger equation use karte hain stationary states find karne ke liye. Ek stationary state ek aisi wavefunction hai jiska probability density time ke saath change nahi hota — yeh quantum system ki ek stable configuration hai. Har mathematical solution physical nahi hota. Boundary conditions invalid solutions ko filter out karti hain wavefunction ko system ki edges par sahi tarah behave karne ki requirement dekar — rigid walls par zero, infinity par zero ki taraf decay. Sirf wahi wavefunction shapes real hain jo yeh conditions satisfy karti hain. Har real shape ek specific energy se correspond karti hai. Yahi tarah se quantized energy levels naturally Schrodinger equation se emerge hoti hain.",
                            },
                        ],
                        Examples: [
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "StringFixedAtEnds",
                                ExampleContent:
                                    "A guitar string fixed at both ends can form only certain standing wave patterns. A quantum wavefunction in a restricted region follows the same logic: only shapes that fit the boundaries are allowed.",
                            },
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "DiscreteEnergyLevels",
                                ExampleContent:
                                    "When an electron in a hydrogen atom jumps from a higher energy state to a lower one, it emits a photon of light. The color of that light is determined by the exact energy difference between the two states. The distinct colored lines in atomic emission spectra — each element has its own unique pattern — are direct experimental evidence of quantized energy levels produced by boundary conditions in the Schrodinger equation.",
                            },
                        ],
                        Hints: [
                            {
                                HintName: "CheckTheBoundaries",
                                HintContent:
                                    "After solving the equation algebraically, always check whether the resulting wavefunction actually satisfies the physical boundaries of the system.",
                            },
                        ],
                        Asset: {
                            Type: ASSET_TYPES.IMAGE,
                            AssetName: "BoundaryEnergyCard",
                            FileName: "topic-07-boundary-energy-card.svg",
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
                    },
                    Question: null,
                },
                {
                    TopicType: TOPIC_TYPES.QUIZ,
                    Title: "Quiz: Boundary Conditions",
                    Description:
                        "Check your understanding of what boundary conditions do in the Schrodinger equation.",
                    DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                    Keywords: ["boundary conditions", "stationary states", "allowed energies"],
                    SEO: {
                        Slug: "quiz-boundary-conditions",
                        MetaTitle: "Quiz: Boundary Conditions | Schrodinger Equation | KickBi",
                        MetaDescription: "Test your understanding of what boundary conditions do in the Schrodinger equation and how they lead to quantized energy levels.",
                        OgTitle: "Quiz: Boundary Conditions | KickBi",
                        OgDescription: "Quick quiz on boundary conditions in the Schrodinger equation and their role in creating quantized energy levels.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/quiz-boundary-conditions",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Quiz", "name": "Quiz: Boundary Conditions", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Intermediate" }),
                    },
                    Content: null,
                    Question: {
                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                        Question: "What do boundary conditions help decide?",
                        Options: [
                            "Which wavefunctions are physically allowed",
                            "The color of the particle",
                            "Whether probability should be ignored",
                            "Whether time exists",
                        ],
                        Answer: "Which wavefunctions are physically allowed",
                        AnswerDescription:
                            "Boundary conditions filter the mathematical solutions of the Schrodinger equation and keep only the ones that match the physical system. This is how quantized energy levels arise.",
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Boundary conditions filter which wavefunctions are physically real. They remove solutions that do not fit the system.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Boundary conditions filter karti hain ki kaun se wavefunctions physically real hain. Yeh un solutions ko remove karti hain jo system mein fit nahi hote.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "A string fixed at both ends can only vibrate in certain shapes. Boundary conditions do the same job for quantum wavefunctions.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Dono ends par fixed string sirf kuch shapes mein vibrate kar sakti hai. Boundary conditions quantum wavefunctions ke liye same kaam karti hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The answer is option 1. The other options are clearly unphysical. Boundary conditions are purely about filtering allowed wavefunction shapes.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Answer option 1 hai. Baaki options clearly unphysical hain. Boundary conditions sirf allowed wavefunction shapes filter karne ke baare mein hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Without boundary conditions, the equation gives infinitely many solutions. Boundary conditions cut that down to only the physically real ones.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Boundary conditions ke bina equation infinitely many solutions deti hai. Boundary conditions unhe sirf physically real tak kam karti hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Boundary conditions decide which wavefunctions physically exist in the system. From those allowed wavefunctions come the allowed energy levels.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Boundary conditions decide karti hain ki system mein kaun se wavefunctions physically exist karte hain. Un allowed wavefunctions se allowed energy levels aate hain.",
                            },
                        ],
                    },
                },
                {
                    TopicType: TOPIC_TYPES.THEORY,
                    Title: "Two Classic Results: Box and Tunneling",
                    Description:
                        "How the equation explains quantized energy and tunneling in a simple way.",
                    DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                    Keywords: ["particle in a box", "tunneling", "quantization", "barrier"],
                    SEO: {
                        Slug: "two-classic-results-box-and-tunneling",
                        MetaTitle: "Particle in a Box & Quantum Tunneling | Schrodinger Equation | KickBi",
                        MetaDescription: "Learn how the Schrodinger equation explains quantized energy in a particle in a box and quantum tunneling through a barrier. Intermediate level.",
                        OgTitle: "Particle in a Box and Tunneling | KickBi",
                        OgDescription: "Two classic quantum results: quantized energy from a particle in a box and wavefunction tunneling through a barrier.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/two-classic-results-box-and-tunneling",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "LearningResource", "name": "Two Classic Results: Box and Tunneling", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Intermediate", "learningResourceType": "Lesson" }),
                    },
                    Content: {
                        RawContent: `[H:H2] Problem 1: Particle in a Box [/H:H2]

[P] The [B] particle in a box [/B] is the simplest quantum system you can study. The setup: a particle is trapped inside a one-dimensional region from [CODE] x = 0 [/CODE] to [CODE] x = L [/CODE]. The walls at both ends are perfectly rigid — the potential energy is infinite outside the box and zero inside. [/P]

[P] [B] Boundary conditions: [/B] [MATH] \psi = 0 [/MATH] at [CODE] x = 0 [/CODE] and [MATH] \psi = 0 [/MATH] at [CODE] x = L [/CODE]. [/P]

[P] These two conditions mean the wavefunction must start at zero, end at zero, and form a smooth standing wave in between. The only wavefunction shapes that satisfy both conditions are those that fit an exact number of half-wavelengths inside the box: [/P]

[UL]
[LI] [B] n = 1: [/B] one half-wavelength fits → lowest energy state (ground state) [/LI]
[LI] [B] n = 2: [/B] two half-wavelengths fit → second energy state (first excited state) [/LI]
[LI] [B] n = 3: [/B] three half-wavelengths fit → third energy state [/LI]
[LI] ... and so on for every positive integer [CODE] n [/CODE] [/LI]
[/UL]

[EXAMPLE:StandingWaveInBox]

[H:H2] The Energy Formula and Its Consequences [/H:H2]

[P] Solving the TISE for a particle in a box gives the energy of the [CODE] n [/CODE]th state: [/P]

[P] [MATH] E_n = \frac{n^2 \pi^2 \hbar^2}{2mL^2} \quad n = 1, 2, 3, \ldots [/MATH] [/P]

[P] Three important observations: [/P]

[OL]
[LI] [B] Energies are discrete. [/B] Only specific values of [CODE] E [/CODE] are physically allowed. The particle cannot have just any energy. [/LI]
[LI] [B] The minimum energy is not zero. [/B] The lowest state ([CODE] n = 1 [/CODE]) has energy [MATH] E_1 = \pi^2 \hbar^2 / (2mL^2) [/MATH], which is greater than zero. This is called [B] zero-point energy [/B], and it is a purely quantum phenomenon with no classical counterpart. [/LI]
[LI] [B] n = 0 is forbidden. [/B] If [CODE] n [/CODE] were 0, the wavefunction would be zero everywhere, which means there is no particle — not a particle at rest. [/LI]
[/OL]

[ASSET:BoxAndTunnelingCard]

[H:H2] Problem 2: Quantum Tunneling [/H:H2]

[P] Now consider a particle moving toward a [B] potential barrier [/B] — a region where the potential energy [CODE] V [/CODE] is higher than the particle's total energy [CODE] E [/CODE]. [/P]

[P] In [B] classical physics [/B], the story is simple: if you do not have enough energy to get over a hill, you cannot cross it. The particle bounces back. [/P]

[P] In [B] quantum physics [/B], the story is completely different. The wavefunction does not stop at the barrier wall. Instead, it decays [B] exponentially [/B] through the barrier region. If the barrier is thin enough, the wavefunction retains a nonzero value on the far side. This means there is a real, measurable probability of detecting the particle on the other side — even though it did not have enough energy to classically climb over the barrier. [/P]

[HINT:WaveDoesNotStopInstantly]

[EXAMPLE:TunnelingThroughBarrier]

[H:H2] Quantum Tunneling in the Real World [/H:H2]

[P] Tunneling is not a theoretical curiosity. It drives real, observable phenomena: [/P]

[UL]
[LI] [B] Nuclear fusion in stars: [/B] protons tunnel through the electric repulsion barrier to fuse [/LI]
[LI] [B] Alpha decay: [/B] a nucleus decays when the alpha particle tunnels out through the barrier [/LI]
[LI] [B] Scanning tunneling microscope (STM): [/B] images individual atoms by measuring the tunneling current between a sharp tip and a surface [/LI]
[/UL]

[H:H2] The Shared Lesson [/H:H2]

[P] Both results — quantized energy in a box and tunneling through a barrier — arise from the same source: [B] the wavefunction does not stop abruptly at boundaries [/B]. It responds smoothly and continuously to the potential. The Schrodinger equation captures this response, and the consequences are phenomena that classical physics is completely unable to predict. [/P]`,
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The particle in a box and quantum tunneling are two landmark results that show you exactly what the Schrodinger equation is capable of. For the particle in a box: the wavefunction must be zero at both walls, and this forces the wave to fit as an exact number of half-wavelengths. Since only certain wave shapes fit, only certain energies are allowed. The energy levels are Eₙ = n²π²ℏ²/(2mL²), and they are discrete. For tunneling: when a particle hits a barrier higher than its energy, classical physics says it is blocked. But the wavefunction decays exponentially through the barrier rather than stopping. If the barrier is thin enough, the wavefunction survives to the other side, giving a real, nonzero probability of finding the particle beyond the barrier. Both results follow directly from solving the Schrodinger equation.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Particle in a box aur quantum tunneling do landmark results hain jo tumhe exactly dikhate hain ki Schrodinger equation kya karne mein capable hai. Particle in a box ke liye: wavefunction dono walls par zero honi chahiye, aur yeh wave ko exact number of half-wavelengths ke roop mein fit hone par force karta hai. Kyunki sirf kuch wave shapes fit hoti hain, sirf kuch energies allowed hain. Energy levels Eₙ = n²π²ℏ²/(2mL²) hain, aur woh discrete hain. Tunneling ke liye: jab ek particle ek aisi barrier se takraata hai jis ki energy usse zyada hai, classical physics kehti hai woh block ho gaya. Lekin wavefunction barrier ke through exponentially decay karti hai rukne ke bajay. Agar barrier kafi patli hai, wavefunction dusri taraf survive karti hai, particle ko barrier ke paar milne ki ek real, nonzero probability deti hai. Donon results directly Schrodinger equation solve karne se follow karte hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "For the particle in a box, the best analogy is a guitar string. A guitar string fixed at both ends can only vibrate in standing wave patterns — one arch, two arches, three arches, and so on. Each pattern corresponds to a specific musical note. A quantum particle in a box works exactly the same way. The boundary conditions are the fixed ends. The wavefunction must form standing waves between them. Only certain patterns fit. Each pattern gives a specific energy level. Now for tunneling: think of it like a ghost being able to walk through a wall. Classically impossible — but in quantum mechanics, the wavefunction extends into and through the barrier, giving a nonzero probability of emergence on the other side. Not magic, just wave behavior.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Particle in a box ke liye, sabse achhi analogy guitar string hai. Dono ends par fixed ek guitar string sirf standing wave patterns mein vibrate kar sakti hai — ek arch, do arches, teen arches, aur aage. Har pattern ek specific musical note se correspond karta hai. Ek quantum particle in a box exactly same tarah kaam karta hai. Boundary conditions fixed ends hain. Wavefunction ko unke beech standing waves form karni padti hain. Sirf kuch patterns fit hote hain. Har pattern ek specific energy level deta hai. Ab tunneling ke liye: isse ek ghost ki tarah socho jo wall se guzar sakti hai. Classically impossible — lekin quantum mechanics mein, wavefunction barrier mein aur uske through extend hoti hai, dusri taraf emergence ki ek nonzero probability deti hai. Koi magic nahi, sirf wave behavior.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me walk through the particle in a box calculation explicitly. The setup: V = 0 inside (0 to L), V = infinity at the walls. Boundary conditions: ψ(0) = 0 and ψ(L) = 0. The TISE inside the box simplifies to d²ψ/dx² = −k²ψ, which has solutions ψ = A·sin(kx) + B·cos(kx). Applying ψ(0) = 0 forces B = 0. Applying ψ(L) = 0 forces sin(kL) = 0, so kL = nπ, meaning k = nπ/L. The energy is then E = ℏ²k²/(2m) = n²π²ℏ²/(2mL²). This is the complete derivation. For tunneling, inside a classically forbidden barrier where V > E, the solution changes from oscillating to decaying: ψ decays as e^−κt, where κ depends on how much V exceeds E. The wavefunction is nonzero at the far edge of the barrier, giving tunneling probability.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main particle in a box calculation explicitly walk through karta hoon. Setup: V = 0 andar (0 se L tak), V = infinity walls par. Boundary conditions: ψ(0) = 0 aur ψ(L) = 0. Box ke andar TISE simplify hoti hai d²ψ/dx² = −k²ψ, jiske solutions hain ψ = A·sin(kx) + B·cos(kx). ψ(0) = 0 apply karne se B = 0 force hota hai. ψ(L) = 0 apply karne se sin(kL) = 0 force hota hai, isliye kL = nπ, matlab k = nπ/L. Energy phir E = ℏ²k²/(2m) = n²π²ℏ²/(2mL²) hai. Yeh complete derivation hai. Tunneling ke liye, classically forbidden barrier ke andar jahan V > E, solution oscillating se decaying mein change ho jaata hai: ψ e^−κt ki tarah decay karta hai, jahan κ is baat par depend karta hai ki V, E se kitna zyada hai. Wavefunction barrier ke far edge par nonzero hai, tunneling probability deta hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Two common mistakes on this topic. Mistake one: thinking the minimum energy in a box is zero. It is not. The ground state energy E₁ = π²ℏ²/(2mL²) is greater than zero. This zero-point energy is real and measurable. n = 0 would make ψ = 0 everywhere — meaning there is no particle at all, not a particle at rest. Mistake two: for tunneling, thinking that the particle gains energy from somewhere to cross the barrier. It does not. The particle's energy throughout is less than the barrier height. What tunneling means is that the wavefunction is nonzero on the far side — not that the particle found a way to get over the top. The wavefunction goes through, not over.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Is topic par do common mistakes hain. Mistake ek: yeh sochna ki box mein minimum energy zero hai. Aisa nahi hai. Ground state energy E₁ = π²ℏ²/(2mL²) zero se greater hai. Yeh zero-point energy real aur measurable hai. n = 0 ψ = 0 everywhere bana dega — matlab koi particle hi nahi hai, rest par particle nahi. Mistake do: tunneling ke liye, yeh sochna ki particle barrier cross karne ke liye kahin se energy gain karta hai. Aisa nahi hota. Particle ki energy poori tarah barrier height se kam rehti hai. Tunneling ka matlab hai ki wavefunction far side par nonzero hai — yeh nahi ki particle ne upar se guzarne ka koi tarika dhundha. Wavefunction guzarti hai usse, upar se nahi.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Let me give you the key takeaway for both results. For the particle in a box: trap a particle between rigid walls, apply the boundary condition that ψ = 0 at both walls, and you find that only discrete energy levels exist. The energies are Eₙ = n²π²ℏ²/(2mL²), the minimum energy is nonzero, and the bigger the box, the lower the energy levels. For quantum tunneling: a wavefunction does not stop sharply at a barrier. It decays through the barrier region. If the barrier is thin enough, the wavefunction retains a nonzero value at the other edge, giving a real tunneling probability. Both of these are direct consequences of treating particles as wavefunctions, not as classical balls.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Main tumhe donon results ke liye key takeaway deta hoon. Particle in a box ke liye: ek particle ko rigid walls ke beech trap karo, boundary condition apply karo ki ψ = 0 dono walls par, aur tum paoge ki sirf discrete energy levels exist karti hain. Energies Eₙ = n²π²ℏ²/(2mL²) hain, minimum energy nonzero hai, aur jitna bada box, utni kam energy levels. Quantum tunneling ke liye: ek wavefunction ek barrier par sharply nahi rukti. Yeh barrier region ke through decay karti hai. Agar barrier kafi patli hai, wavefunction dusre edge par nonzero value retain karti hai, ek real tunneling probability deti hai. Yeh donon direct consequences hain particles ko classical balls ki jagah wavefunctions ki tarah treat karne ke.",
                            },
                        ],
                        Examples: [
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
                                ExampleName: "StandingWaveInBox",
                                ExampleContent:
                                    "A wave on a string fixed at both ends can only fit in certain patterns: one half-wavelength, one full wavelength, and so on. A particle in a quantum box has the same condition, which is why its energy is quantized.",
                            },
                            {
                                DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                                ExampleName: "TunnelingThroughBarrier",
                                ExampleContent:
                                    "An alpha particle inside a radioactive nucleus is held in by a potential barrier. Its total energy is lower than the barrier height, so classically it can never escape. But because the wavefunction decays exponentially through the barrier instead of stopping at the edge, there is a small but nonzero probability of the alpha particle appearing outside the nucleus. Over time this probability adds up, and the nucleus undergoes alpha decay. This is quantum tunneling operating in real nuclear physics.",
                            },
                        ],
                        Hints: [
                            {
                                HintName: "WaveDoesNotStopInstantly",
                                HintContent:
                                    "For tunneling problems, the wavefunction decays exponentially inside the barrier instead of becoming zero immediately at the barrier edge.",
                            },
                        ],
                        Asset: {
                            Type: ASSET_TYPES.IMAGE,
                            AssetName: "BoxAndTunnelingCard",
                            FileName: "topic-09-box-and-tunneling-card.svg",
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
                    },
                    Question: null,
                },
                {
                    TopicType: TOPIC_TYPES.QUIZ,
                    Title: "Quiz: Particle in a Box",
                    Description:
                        "Check your understanding of quantized energy in a particle-in-a-box system.",
                    DifficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
                    Keywords: ["particle in a box", "quantization", "boundary conditions"],
                    SEO: {
                        Slug: "quiz-particle-in-a-box",
                        MetaTitle: "Quiz: Particle in a Box | Schrodinger Equation | KickBi",
                        MetaDescription: "Test your understanding of why energy is quantized in a particle-in-a-box quantum system and what boundary conditions do.",
                        OgTitle: "Quiz: Particle in a Box | KickBi",
                        OgDescription: "Quick quiz on quantized energy levels in a particle-in-a-box system and the role of boundary conditions.",
                        CanonicalUrl: "/courses/schrodinger-equation/topics/quiz-particle-in-a-box",
                        JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "Quiz", "name": "Quiz: Particle in a Box", "isPartOf": { "@type": "Course", "name": "Schrodinger Equation" }, "educationalLevel": "Intermediate" }),
                    },
                    Content: null,
                    Question: {
                        Type: QUESTION_TYPES.MULTIPLE_CHOICE,
                        Question: "Why are energies quantized in a particle in a box?",
                        Options: [
                            "Only certain wavefunction shapes fit the boundaries",
                            "The particle loses all motion",
                            "The barrier disappears",
                            "Probability is ignored",
                        ],
                        Answer: "Only certain wavefunction shapes fit the boundaries",
                        AnswerDescription:
                            "The wavefunction must be zero at the rigid walls of the box. This boundary condition means only certain standing wave shapes fit inside. Each allowed shape corresponds to one allowed energy level.",
                        AIExplanationVersions: [
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Energies are quantized because the wavefunction must satisfy the walls of the box. Only certain shapes fit. Those shapes fix the allowed energy levels.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Energies quantized hain kyunki wavefunction ko box ki walls satisfy karni hoti hain. Sirf kuch shapes fit hoti hain. Woh shapes allowed energy levels fix karti hain.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "A guitar string can only vibrate in certain patterns because both ends are fixed. A quantum particle in a box is the same: the boundary forces only certain wave shapes, and each shape has a fixed energy.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Guitar string sirf kuch patterns mein vibrate kar sakti hai. Quantum particle in a box same hai: boundary sirf kuch wave shapes force karti hai, aur har shape ki fixed energy hoti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "Option 2 is wrong. Quantum particles always have zero-point energy even in the ground state. The quantization comes from the allowed shapes, not from losing motion.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Option 2 galat hai. Quantum particles ko ground state mein bhi zero-point energy hoti hai. Quantization allowed shapes se aati hai, motion kho dene se nahi.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The boundary condition at the rigid walls forces the wavefunction to be zero there. That restriction creates the discrete set of allowed shapes and energies.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Rigid walls par boundary condition wavefunction ko zero hone par force karti hai. Yahi restriction allowed shapes ka discrete set create karti hai.",
                            },
                            {
                                [LANGUAGES_SUPPORTED.ENGLISH]:
                                    "The box has rigid walls, so the wavefunction must be zero at both ends. Only certain standing wave patterns satisfy that. Each pattern has one energy. That is quantization.",
                                [LANGUAGES_SUPPORTED.HINGLISH]:
                                    "Box mein rigid walls hain, isliye wavefunction dono ends par zero hona chahiye. Sirf kuch standing wave patterns yeh satisfy karte hain. Har pattern ki ek energy hoti hai. Yahi quantization hai.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};

// ---------------------------------------------------------------------------
// Seeding helpers
// ---------------------------------------------------------------------------

const buildCoursePayload = (
    subjectId: mongoose.Types.ObjectId,
    aiExplanationVersionIds: mongoose.Types.ObjectId[],
    thumbnailKey?: string
) => ({
    SubjectIds: [subjectId],
    Thumbnail: thumbnailKey,
    Title: schrodingerCourseScript.Course.Title,
    Description: schrodingerCourseScript.Course.Description,
    AIExplanationVersionIds: aiExplanationVersionIds,
    DifficultyLevel: schrodingerCourseScript.Course.DifficultyLevel,
    LanguageSupported: schrodingerCourseScript.Course.LanguageSupported,
    Tags: schrodingerCourseScript.Course.Tags,
    IsPublished: schrodingerCourseScript.Course.IsPublished,
    PublishedAt: new Date(),
    SEO: {
        ...schrodingerCourseScript.Course.SEO,
        OgImage: thumbnailKey,
    },
});

const ensurePhysicsSubject = async () => {
    const subject = await Subject.findOneAndUpdate(
        { Name: SUBJECT_NAME },
        {
            $set: {
                Name: SUBJECT_NAME,
                Description:
                    "Physics courses that explain difficult concepts with clear language, examples, and student-friendly visuals.",
                SEO: {
                    Slug: "physics",
                    MetaTitle: "Physics Courses | Learn Quantum Mechanics & More | KickBi",
                    MetaDescription: "Explore KickBi Physics courses. Master Quantum Mechanics, Classical Physics and more with student-friendly explanations and bilingual support.",
                    OgTitle: "Physics | KickBi",
                    OgDescription: "Learn Physics the easy way with student-friendly courses, simple language, and bilingual explanations.",
                    CanonicalUrl: "/subjects/physics",
                    JsonLd: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", "name": "Physics Courses", "description": "Physics courses on KickBi including Quantum Mechanics and more.", "url": "/subjects/physics" }),
                },
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
    const courseAIIds = await createAIExplanationVersions(
        schrodingerCourseScript.Course.AIExplanationVersions
    );

    let course = await Course.findOne({ Title: COURSE_TITLE });

    if (!course) {
        course = await Course.create(buildCoursePayload(subjectId, courseAIIds));
    } else {
        await Course.findByIdAndUpdate(course._id, buildCoursePayload(subjectId, courseAIIds));
    }

    const thumbnailUpload = await uploadCourseImageToS3(
        String(course._id),
        schrodingerCourseScript.ThumbnailAsset.FileName,
        Buffer.from(schrodingerCourseScript.ThumbnailAsset.Svg, "utf-8"),
        "image/svg+xml"
    );

    await Course.findByIdAndUpdate(
        course._id,
        buildCoursePayload(subjectId, courseAIIds, thumbnailUpload.key)
    );

    const updatedCourse = await Course.findById(course._id);

    if (!updatedCourse) {
        throw new Error("Failed to load the Schrodinger course after update");
    }

    return updatedCourse;
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const generateSchrodingerEquationCourse = async () => {
    const subject = await ensurePhysicsSubject();
    const course = await upsertCourse(subject._id);

    if (!course) {
        throw new Error("Failed to create or update the Schrodinger course");
    }

    await resetExistingHierarchy(course._id);

    const createdChapterIds: string[] = [];
    const createdTopicIds: string[] = [];

    for (const [chapterIndex, chapterScript] of schrodingerCourseScript.Chapters.entries()) {
        const chapterAIIds = await createAIExplanationVersions(chapterScript.AIExplanationVersions);

        const chapter = await Chapter.create({
            CourseId: course._id,
            Title: chapterScript.Title,
            Description: chapterScript.Description,
            AIExplanationVersionIds: chapterAIIds,
            SEO: chapterScript.SEO,
            Order: chapterIndex + 1,
        });

        createdChapterIds.push(String(chapter._id));

        let topicOrder = 0;
        for (const topicScript of chapterScript.Topics) {
            if (topicScript.TopicType === TOPIC_TYPES.THEORY && topicScript.Content) {
                const assetUpload = await uploadCourseImageToS3(
                    String(course._id),
                    topicScript.Content.Asset.FileName,
                    Buffer.from(topicScript.Content.Asset.Svg, "utf-8"),
                    "image/svg+xml"
                );

                const contentAIIds = await createAIExplanationVersions(
                    topicScript.Content.AIExplanationVersions
                );

                const topic = await Topic.create({
                    CourseId: course._id,
                    ChapterId: chapter._id,
                    TopicType: topicScript.TopicType,
                    Title: topicScript.Title,
                    Description: topicScript.Description,
                    DifficultyLevel: topicScript.DifficultyLevel,
                    Keywords: topicScript.Keywords,
                    Order: ++topicOrder,
                    Content: {
                        RawContent: topicScript.Content.RawContent,
                        AIExplanationVersionIds: contentAIIds,
                        Examples: topicScript.Content.Examples,
                        Hints: topicScript.Content.Hints,
                        Assets: [
                            {
                                Type: topicScript.Content.Asset.Type,
                                AssetURI: assetUpload.key,
                                AssetName: topicScript.Content.Asset.AssetName,
                            },
                        ],
                    },
                    SEO: { ...topicScript.SEO, OgImage: assetUpload.key },
                    Question: undefined,
                });

                createdTopicIds.push(String(topic._id));
            } else if (topicScript.TopicType === TOPIC_TYPES.QUIZ && topicScript.Question) {
                const questionAIIds = await createAIExplanationVersions(
                    topicScript.Question.AIExplanationVersions
                );

                const topic = await Topic.create({
                    CourseId: course._id,
                    ChapterId: chapter._id,
                    TopicType: topicScript.TopicType,
                    Title: topicScript.Title,
                    Description: topicScript.Description,
                    DifficultyLevel: topicScript.DifficultyLevel,
                    Keywords: topicScript.Keywords,
                    Order: ++topicOrder,
                    SEO: topicScript.SEO,
                    Content: undefined,
                    Question: {
                        Type: topicScript.Question.Type,
                        Question: topicScript.Question.Question,
                        Options: topicScript.Question.Options,
                        Answer: topicScript.Question.Answer,
                        AnswerDescription: topicScript.Question.AnswerDescription,
                        AIExplanationVersionIds: questionAIIds,
                    },
                });

                createdTopicIds.push(String(topic._id));
            }
        }

        await Chapter.findByIdAndUpdate(chapter._id, {
            TopicsCount: chapterScript.Topics.length,
        });
    }

    await Course.findByIdAndUpdate(course._id, {
        ChaptersCount: schrodingerCourseScript.Chapters.length,
        TopicsCount: createdTopicIds.length,
    });

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
