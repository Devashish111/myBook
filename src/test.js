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

const Test = () => {
    const divCount = 10;
    const divArray = new Array(divCount).fill(null);
    const [inputs, setInputs] = useState(Array(divCount).fill(''));
    const [images, setImages] = useState(Array(divCount).fill(null));

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
    console.log(input);
    setInput((prevInputs) => prevInputs.map((inp, i) => (i === index ? '' : inp)));
  };

  return (
    <div>
      {divArray.map((_, index) => (
        <div key={index}>
          <label>
            <div> Theme for page {index + 1} 
              <input
                type="text"
                value={inputs[index]}
                onChange={(e) => setInputs((prevInputs) => prevInputs.map((inp, i) => (i === index ? e.target.value : inp)))}
              />
              <button onClick={() => handleSubmit(inputs[index], setInputs, setImages, index)}>Submit {index + 1}</button>
            </div>
          </label>
          {images[index] && <img src={URL.createObjectURL(images[index])} alt={`Image ${index + 1}`} />}
        </div>
      ))}
    </div>
  );
};

export default Test;
