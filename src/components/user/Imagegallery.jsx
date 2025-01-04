import React, { useEffect, useState } from 'react';

const ImageGallery = ({ images = [] }) => {
    const defaultImages = [
      "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/7-1.jpg",
      "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/7-2.jpg",
      "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/7-3.jpg",
      "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/7.jpg"
    ];
  
    const [galleryImages,setGalleryImage] = useState(images.length > 0 ? images : defaultImages);
    const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

    useEffect(()=>{
        setGalleryImage(images.length > 0 ? images : defaultImages)
        setSelectedImage(galleryImages[0])
    },[images])
  
    return (
      <div className="col-span-5">
        <div className="overflow-hidden">
          <img 
            src={galleryImages[0]} 
            alt="Main display"
            className="w-full h-auto transition-opacity duration-300 ease-in-out"
          />
        </div>
        
        <div className="flex p-6 pl-8 gap-8 items-center">
          {galleryImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`h-32 cursor-pointer transition-all duration-300 hover:opacity-80 ${
                selectedImage === image ? 'ring-2 ring-[#be7474]' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>
    );
  };

export default ImageGallery;