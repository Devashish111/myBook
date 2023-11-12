import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
  
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
  
  console.log('result');
  return result;
}

const Splitpage = () => {
  // const divCount=10;
  const [divCount,setDivCount]=useState(1);
  const [loading,setLoading]=useState(false);
  const divArray = new Array(divCount).fill(null);
  const [inputs, setInputs] = useState(Array(divCount).fill(''));
  const [images, setImages] = useState(Array(divCount).fill(null));
  const [isHovered, setIsHovered] = useState(Array(divCount).fill(false));
  const [ind,setInd]=useState(0);
  const fetchData = async (input, index) => {
    try {
      setLoading(true);
      const response = await query({ "inputs": input });
      setImages((prevImages) => prevImages.map((img, i) => (i === index ? response : img)));
      
    } catch (error) {
      console.error('Error fetching image:', error);
    }finally{
      setLoading(false);
      console.log(loading);
    }
    
  };

  const handleSubmit = (input, setInput, setImage, index) => {
    setImages((prevImages) => prevImages.map((img, i) => (i === index ? null : img)));
    console.log(loading);
    fetchData (input, index);
    setInd(index);  
    console.log(index);
    console.log(input);
    console.log(inputs.length);
    setInputs((prevInputs) => {
      return prevInputs.map((inp, i) => {
        if (i === index) {
          return '';
        } else {
          return inp;
        }
      });
    });
  };
  const handlePageClick=(index)=>{
    setInd(index);
  }
  const handlePlus=()=>{
    setDivCount((prevCount) => prevCount + 1);
  setInputs((prevInputs) => [...prevInputs, '']);
  setImages((prevImages) => [...prevImages, null]);
  setIsHovered((prevHovered) => [...prevHovered, false]);
  setInd((prevInd) => prevInd + 1);
  }
  const handleDelete = (index) => {
    setDivCount((prevCount) => Math.max(1, prevCount - 1));
  
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  
    setIsHovered((prevHovered) => prevHovered.slice(0, -1)); // Assuming isHovered corresponds to each page
    setInd((prevInd) => Math.max(0, prevInd - 1));
  };
  const handleMinus = (ind) => {
    if (divCount > 1) {
      handleDelete(ind);
    }
  };
  const exportImagesAsPDF = async () => {
    const pdf = new jsPDF();
  
    const addImageToPDF = (image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
  
          const pageWidth = width + 20; // Adjust the margins as needed
          const pageHeight = height + 20; // Adjust the margins as needed
  
          pdf.addImage(img, 'PNG', 10, 10, width, height);
          pdf.addPage([pageWidth, pageHeight]); // Set the page size equal to the image size
          resolve();
        };
        img.src = URL.createObjectURL(image);
      });
    };
  
    await Promise.all(images.map(async (image) => {
      if (image === null) {
        return;
      }
  
      await addImageToPDF(image);
    }));
  
    pdf.save('YourStory.pdf');
  };
  
  
  return (
    <div>
        <div id='boxes'>
        {Array(divCount).fill(null).map((_, index) => (
        <div id='eachBox'
          key={index}
          style={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setIsHovered((prevHovered) => prevHovered.map((h, i) => (i === index ? true : h)))}
          onMouseLeave={() => setIsHovered((prevHovered) => prevHovered.map((h, i) => (i === index ? false : h)))}
        >
          <label>
            
              
              <button type="button" id='btn' class="btn btn-secondary" onClick={()=>handlePageClick(index)} >Page{index + 1}</button>
            
          </label>
        
        </div>
      ))}
      
        </div>
      
      <hr></hr>
      <button id="plusbtn" onClick={handlePlus}><FontAwesomeIcon icon={faPlus} /></button>
      <button id="deletebtn" onClick={() => handleMinus(ind)}><FontAwesomeIcon icon={faTrash} /></button>
      <button type="button" onClick={exportImagesAsPDF}>Export as PDF</button>
      <div id='bottom'>
        <h2 id='heading'>Page {ind+1}</h2>
      <input 
            placeholder={`Write content for Page ${ind + 1}`}
            id='input'
            type="text"
            value={inputs[ind]}
            onChange={(e) => setInputs((prevInputs) => prevInputs.map((inp, i) => (i === ind ? e.target.value : inp)))}
        />
        <div id='submit'><button type="button" disabled={(inputs[ind]!='')&&(inputs[ind]!=' ')&&(inputs[ind]!='  ')&&(!loading)?false:true} class="btn btn-success " onClick={() => handleSubmit(inputs[ind], setInputs, setImages, ind)} >
        Create </button></div>
        {(loading&&!images[ind])?(<div id='wait'>Please wait....</div>):(<div id="image">
        {images[ind] && <img id='img' src={URL.createObjectURL(images[ind])} alt={`Image ${ind + 1}`} />}
        </div>)}
        
      
      </div>
      
      
    </div>
  );
};

export default Splitpage;
