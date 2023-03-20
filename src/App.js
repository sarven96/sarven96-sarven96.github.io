import { useState, useEffect, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Navbar from './components/navbar';
import TextEffect1 from './components/textEffect';
import Spinner from './components/spinner';

function App() {
    const [isModelLoading, setIsModelLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [model, setModel] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);

    const imageRef = useRef();
    const textInputRef = useRef();

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            
            const model = await mobilenet.load();
            setModel(model);
            const timeout = setTimeout(() => {
                console.log('Loading');
                setIsModelLoading(false);
            },4000);
            
            
        } catch (error) {
            console.log(error);
            setIsModelLoading(false);
        }
    };

    const uploadImage = (e) => {
        const {files} = e.target;
        if (files.length > 0){
            const url = URL.createObjectURL(files[0]);
            setImageUrl(url);
        } else {
            setImageUrl(null);
        }
    };

    const identify = async () => {
        textInputRef.current.value = '';
        const results = await model.classify(imageRef.current);
        setResults(results);
    };

    const handleOnChange = (e) => {
        setImageUrl(e.target.value);
        setResults([]);
    };

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        if(imageUrl){
            setHistory([imageUrl, ...history]);
        }
    }, [imageUrl]);

    if (isModelLoading) {
        return <h2 className='h-screen flex flex-col justify-center'> <Spinner/> </h2>;
        
    }

    //to remove duplicate objects from history array
    let uniqueHistory = [...new Set(history)];

    // console.warn(history);
    // console.warn(uniqueHistory);

    const toTitleCase = (s)=>{
        if (typeof(s)==='string'&&s.length>0) {
            const words = s.split(' ');
            if (Array.isArray(words)&&words.length>0) {
                if (words.length===1) {
                    const word = words[0];
                    const matches = word.charAt(0).match(/\w+/i);
                    const lines = word.split('\n');
                    if (Array.isArray(lines)&&lines.length>1) {
                        return lines.map(line=>{
                            return toTitleCase(line);
                        }).join('\n');
                    } else if (Array.isArray(matches)) {
                        return word.split('').map((c,i)=>{
                            if (i===0) {
                                return c.toUpperCase();
                            }
                            return c.toLowerCase();
                        }).join('');
                    } else {
                        return word.charAt(0).concat(toTitleCase(word.slice(1)));
                    }
                } else {
                    return words.map(word=>toTitleCase(word)).join(' ');
                }
            }
        }
        return '';
    };

    return (
        
        <>
            <div>
                <Navbar />
            </div>
            <div className='h-screen'>
                <div className="App">
                    <div className='max-w-[900px] mt-[100px] w-full  mx-auto text-center flex flex-col justify-center'>
                        <div className="">
                            <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'><TextEffect1/></h1>
                            <h2 className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>An Image Classification Machine Learning Model</h2>
                            <p className="md:text-2xl text-xl font-bold mt-12 tracking-widest ">
              “Image classification is the task of assigning a label or class to an entire image. Images are expected to have only one class for each image. Image classification models take an image as input and return a prediction about which class the image belongs to.”
                            </p> 
                        </div>
                        
                        <form>
                            <input onChange={uploadImage} type="file" accept='image/*' capture='camera' className="
                                text-md text-grey-500
                                file:mr-4 file:py-4 file:px-8
                                file:rounded-full file:border-0
                                file:text-md file:font-medium
                                file:bg-sky-500 file:text-white
                                hover:file:cursor-pointer hover:file:bg-sky-600
                                hover:file:text-white
                                mt-12
                                hover:scale-105 duration-150
                               
                            " />
                        </form>

                        <div>
                            <label className="flex flex-col-reverse relative focus group">    
                                <input
                                    ref={textInputRef} onChange={handleOnChange}
                                    type="text" name="imageUrl" placeholder='Image URL' 
                                    className="border-2 border-black px-4 py-3 leading-9 m-8 hover:scale-105 duration-150"/>
                            </label>
                        </div>
                    </div>
                    
                    <div className='w-full bg-white py-16 px-4'>
                        <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 shadow-xl rounded-lg'>
                            <div>
                                {imageUrl && <img className="w-[620px] h-[500px] object-cover overflow-hidden rounded-l-lg" src={imageUrl} alt='Upload Preview' crossOrigin='anonymous' ref={imageRef} />}
                            </div>
                            {history.length > 0 && <div className='flex flex-col justify-center'>
                                {results.map((result, index) => {
                                    return (
                                        <div className='' key={result.className}>
                                            <p className=' md:text-4xl sm:text-3xl text-2xl py-2 p-4'>Accuracy : {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='ml-4 bestGuess underline text-sky-500 hover:text-sky-400 decoration-pink-500'> Best Guess </span>}</p>
                                            <span className='md:text-2xl sm:text-1xl text-xl py-2 p-4 text-sky-500'>{toTitleCase(result.className)}</span>
                                        </div>
                                    );
                                })}
                            </div>}
                        </div>
                        <div className=' max-w-[1240px] w-full mt-[20px] mx-auto flex flex-row justify-center'>
                            <button className='bg-sky-500 hover:bg-sky-600 ... text-white w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3 hover:scale-105 duration-150' onClick={identify}>Identify Image</button>
                        </div>

                    </div>

                    {history.length > 0 && <div className="recentPredictions w-full py-16 px-4">

                        <div className='mx-auto grid'>
                            <div >
                                <div>
                                    <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2 px-4'>Recent Images</h1>
                                </div>
                                
                                <div className="masonry sm:masonry-sm md:masonry-md" >
                                    {uniqueHistory.map((image, index) => {

                                        return (
                                            <div className='p-4 break-inside' key={`${image}${index}`}>
                                                <div >
                                                    <img className='resultImage shadow-xl rounded-lg hover:scale-105 duration-150 cursor-pointer ...' src={image} alt='Recent Prediction' onClick={() => setImageUrl(image)} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>}

                </div>
            </div>
        </>
    );
}

export default App;
