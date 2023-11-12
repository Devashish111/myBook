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

const YourComponent = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const [input6, setInput6] = useState('');
  const [input7, setInput7] = useState('');
  const [input8, setInput8] = useState('');
  const [input9, setInput9] = useState('');
  const [input10, setInput10] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image6, setImage6] = useState(null);
  const [image7, setImage7] = useState(null);
  const [image8, setImage8] = useState(null);
  const [image9, setImage9] = useState(null);
  const [image10, setImage10] = useState(null);

  const fetchData = async (input, setImage) => {
    try {
      const response = await query({ "inputs": input });
      setImage(response);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleSubmit = (input, setInput, setImage) => {
    fetchData(input, setImage);
    console.log(input);
    setInput('');
  };

  return (
    <div>
      <div>
        <label>
          <div> Theme for page 1 <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          /> 
          <button onClick={() => handleSubmit(input1, setInput1, setImage1)}>Submit 1</button>
          </div>
          
        </label>
        
        {image1 && <img src={URL.createObjectURL(image1)} alt="Image 1" />}
      </div>
      {/* ----------------------------------------------------------------------- */}
      <div>
        <label>
          <div> Theme for page 2 <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          /> 
          <button onClick={() => handleSubmit(input2, setInput2, setImage2)}>Submit 2</button>
          </div>
          
        </label>
        
        {image2 && <img src={URL.createObjectURL(image2)} alt="Image 2" />}
      </div>
      {/* ----------------------------------------------------------------------- */}
      <div>
        <label>
          <div> Theme for page 3 <input
            type="text"
            value={input3}
            onChange={(e) => setInput3(e.target.value)}
          /> 
          <button onClick={() => handleSubmit(input3, setInput3, setImage3)}>Submit 3</button>
          </div>
          
        </label>
        
        {image3 && <img src={URL.createObjectURL(image3)} alt="Image 2" />}
      </div>
      {/* ----------------------------------------------------------------------- */}
      <div>
        <label>
          <div> Theme for page 4 <input
            id='inputpassword2'
            type="text"
            value={input4}
            onChange={(e) => setInput4(e.target.value)}
          /> 
          <button onClick={() => handleSubmit(input4, setInput4, setImage4)}>Submit 4</button>
          </div>
          
        </label>
        
        {image4 && <img src={URL.createObjectURL(image4)} alt="Image 2" />}
      </div>
    </div>
  );
};

export default YourComponent;
