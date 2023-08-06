import {useEffect, useState} from "react";
import {BiSolidVolumeFull} from "react-icons/bi"

const WordCard = (props) => {
    const {id} = props;
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
            <></>
        )
    }
    return (
        <div className="flex-1 w-full flex flex-col items-center overflow-y-auto px-4" style={{
            maxHeight: 'calc(100vh - 140px)'
        }}>
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
