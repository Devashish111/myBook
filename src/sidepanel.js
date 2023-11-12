import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
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
const SidePanel = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [divCount,setDivCount]=useState(1);
  const divArray = new Array(divCount).fill(null);
  const [inputs, setInputs] = useState(Array(divCount).fill(''));
  const [images, setImages] = useState(Array(divCount).fill(null));
  const [isHovered, setIsHovered] = useState(Array(divCount).fill(false));
  const [ind,setInd]=useState(0);
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
  const handleMinus = () => {
    if (divCount > 1) {
      setDivCount((prevCount) => prevCount - 1);
      setInputs((prevInputs) => prevInputs.slice(0, -1));
      setImages((prevImages) => prevImages.slice(0, -1));
      setIsHovered((prevHovered) => prevHovered.slice(0, -1));
      setInd((prevInd) => Math.max(0, prevInd - 1));
      // Add any other state arrays you have here
    }
  };
  const exportImagesAsPDF = () => {
    const pdf = new jsPDF();
  
    images.forEach((image, index) => {
      const x = 10;
      const y = 10 + index * 110; // Adjust the spacing between images
      const width = 100;
      const height = 100;
  
      if (image instanceof Blob) {
        // Convert Blob to Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result;
          pdf.addImage(imageDataUrl, 'PNG', x, y, width, height);
          if (index !== images.length - 1) {
            pdf.addPage();
          }
        };
        reader.readAsDataURL(image);
      } else {
        console.error('Invalid image data:', image);
      }
    });
  
    pdf.save('images.pdf');
  };

  return (
    <div className="splitpage-container">
      <div id="boxes">
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
      <button className='btn btn-success btn-lg btn-block' id='plusbtn' onClick={handlePlus}>+</button>
      <button className='btn btn-danger btn-lg btn-block' id='plusbtn' onClick={handleMinus}>-</button>
      <button type="button" onClick={exportImagesAsPDF}>Export as PDF</button>
      </div>

      <div id="bottom">
        <h2 id="heading">Page {ind + 1}</h2>
        <input
          placeholder={`Write content for Page ${ind + 1}`}
          id="input"
          type="text"
          value={inputs[ind]}
          onChange={(e) =>
            setInputs((prevInputs) =>
              prevInputs.map((inp, i) => (i === ind ? e.target.value : inp))
            )
          }
        />
        <div id="submit">
          <button
            type="button"
            disabled={
              inputs[ind] !== '' && inputs[ind] !== ' ' && inputs[ind] !== '  '
                ? false
                : true
            }
            className="btn btn-success btn-lg btn-block"
            onClick={() => handleSubmit(inputs[ind], setInputs, setImages, ind)}
          >
            Create
          </button>
        </div>
        <div id="image">
          {images[ind] && <img id="img" src={URL.createObjectURL(images[ind])} alt={`Image ${ind + 1}`} />}
        </div>
      </div>

      {/* Responsive side panel for pages on small screens */}
      {isSmallScreen && (
        <div className="sidePanel">
          <button type="button" onClick={exportImagesAsPDF}>
            Export as PDF
          </button>
          <hr />
          {divArray.map((_, index) => (
            <button
              key={index}
              className={`pageButton ${ind === index ? 'active' : ''}`}
              onClick={() => handlePageClick(index)}
            >
              Page {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Plus and minus buttons for larger screens */}
      {!isSmallScreen && (
        <div className="plusMinusButtons">
          <button id="plusbtn" onClick={handlePlus}>
            +
          </button>
          <button id="minusbtn" onClick={handleMinus}>
            -
          </button>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
