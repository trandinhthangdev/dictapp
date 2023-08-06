import {useEffect, useState} from "react";
import {BiSolidVolumeFull} from "react-icons/bi"
import {IoMdCloseCircle} from "react-icons/io"
const WordCard = (props) => {
    const {id, onReset} = props;
    const [word, setWord] = useState(null);
    const [showDefineVi,setShowDefineVi] = useState(false)
    const [showExVi, setShowExVi] = useState({})
    useEffect(() => {
        setWord(null)
        setShowDefineVi(false);
        setShowExVi({})
        fetch(`https://res.cloudinary.com/doiwoc2sz/raw/upload/words/${id}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response body as JSON
            })
            .then(data => {
                setWord(data)
            })
            .catch(error => {
            });
    }, [id]);

    useEffect(() => {
        onPronunciationWord();
    }, [word]);
    const onPronunciationWord = () => {
        if (!word) return;
        const audio = new Audio(word.audio);
        audio.play();
    }
    if (!word) {
        return (
            <div className="flex flex-col items-center">
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex-1 w-full flex flex-col items-center overflow-y-auto px-4 mt-8" style={{
            maxHeight: 'calc(100vh - 140px)'
        }}>
            <div className="fixed top-[150px] cursor-pointer text-2xl text-red-500 hover:text-red-800" onClick={() => {
                onReset()
            }}>
                <IoMdCloseCircle />
            </div>
            {word.hasImg && (
                <div className="">
                    <img
                        className="w-[300px]"
                        src={`https://res.cloudinary.com/darrspnxu/raw/upload/words/${word.id}.png`}
                    />
                </div>
            )}
            <div className="text-4xl cursor-pointer hover:text-green-600" onClick={() => {
                onPronunciationWord()
            }}>
                <BiSolidVolumeFull />
            </div>
            <div className="font-bold text-xl">{word.word}</div>
            <div className="text-cyan-500">
                /{word.phonetic.trim()}/
            </div>
            <div className="text-orange-600">{word.type}</div>
            <div className="cursor-pointer text-lg my-2" onClick={() => setShowDefineVi(prev => !prev)}>
                <div className="text-blue-600 text-center">
                    {word.define.en}
                </div>
                {showDefineVi && <div className="text-red-600 text-center">
                    {word.define.vi}
                </div>}
            </div>

            <ul className="list-disc pl-4">
                {
                    word.examples.map((itemEx, index) => {
                        return (
                            <li className="italic cursor-pointer mb-1" onClick={() => {
                                setShowExVi(prev => {
                                    const tempPrev = {...prev}
                                    if (prev.hasOwnProperty(index)) {
                                        delete tempPrev[index];
                                    } else {
                                        tempPrev[index] = true
                                    }
                                    return tempPrev
                                })
                            }}>
                                <div className="text-gray-500 flex items-center">
                                    {itemEx.en}
                                    <span className="text-lg ml-2 hover:text-green-600" onClick={(event) => {
                                        event.stopPropagation();
                                        if ('speechSynthesis' in window) {
                                            const synth = window.speechSynthesis;
                                            const utterance = new SpeechSynthesisUtterance(itemEx.en);
                                            utterance.lang = 'en-US';
                                            synth.speak(utterance);
                                        }
                                    }}>
                                        <BiSolidVolumeFull />
                                    </span>
                                </div>
                                {showExVi[index] && <div className="text-red-500 flex items-center">
                                    {itemEx.vi}
                                    <span className="text-lg ml-2 hover:text-green-600" onClick={(event) => {
                                        event.stopPropagation();
                                        if ('speechSynthesis' in window) {
                                            const synth = window.speechSynthesis;
                                            const utterance = new SpeechSynthesisUtterance(itemEx.vi);
                                            utterance.lang = 'vi-VN';
                                            synth.speak(utterance);
                                        }
                                    }}>
                                        <BiSolidVolumeFull />
                                    </span>
                                </div>}
                            </li>
                        )

                    })
                }
            </ul>
        </div>
    )
}

export default WordCard;
