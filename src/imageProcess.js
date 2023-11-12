import React, { useState } from 'react';

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        "Accept": "image/png",
        "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

const Imgp = () => {
  const divCount = 10;
  const divArray = new Array(divCount).fill(null);
  const [inputs, setInputs] = useState(Array(divCount).fill(''));
  const [images, setImages] = useState(Array(divCount).fill(null));
  const [isHovered, setIsHovered] = useState(Array(divCount).fill(false));

  const fetchData = async (input, index) => {
    try {
      const response = await query({ "inputs": input });
      setImages((prevImages) => prevImages.map((img, i) => (i === index ? response : img)));
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleSubmit = (input, setInput, setImage, index) => {
    fetchData(input, index);
    setInput((prevInputs) => prevInputs.map((inp, i) => (i === index ? '' : inp)));
  };

  return (
    <div>
      {divArray.map((_, index) => (
        <div id='boxes'
          key={index}
          style={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setIsHovered((prevHovered) => prevHovered.map((h, i) => (i === index ? true : h)))}
          onMouseLeave={() => setIsHovered((prevHovered) => prevHovered.map((h, i) => (i === index ? false : h)))}
        >
          <label>
            <div id='whole'> <h2>Theme for page {index + 1} </h2> 
              <input 
              id='input'
                type="text"
                value={inputs[index]}
                onChange={(e) => setInputs((prevInputs) => prevInputs.map((inp, i) => (i === index ? e.target.value : inp)))}
              />
              <button type="button" id='btn' class="btn btn-outline-success" onClick={() => handleSubmit(inputs[index], setInputs, setImages, index)} >Submit {index + 1}</button>
              {/* <button id='btn' ></button> */}
            </div>
          </label>
          {images[index] && <img src={URL.createObjectURL(images[index])} alt={`Image ${index + 1}`} />}
        
        </div>
      ))}
    </div>
  );
};

export default Imgp;
