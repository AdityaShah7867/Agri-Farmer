import React, { useEffect, useState } from 'react';

const MicrosoftTranslator = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    const isHttps = window.location.protocol === 'https:';
    script.src = `${isHttps ? 'https://ssl' : 'http://www'}.microsofttranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=True&ui=true&settings=Manual&from=`;

    const initializeWidget = () => {
      if (window.Microsoft && window.Microsoft.Translator) {
        window.Microsoft.Translator.Widget.Translate('en', 'hi,gu,mr,ta', 'WidgetFloater', 'dark', '#ffffff', 'auto', 1, 0, 1000);
        console.log('Microsoft Translator initialized');
        setIsLoaded(true);
      } else {
        console.log('Microsoft Translator not available, retrying...');
        setTimeout(initializeWidget, 1000);
      }
    };

    script.onload = initializeWidget;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTranslate = () => {
    if (isLoaded && window.Microsoft && window.Microsoft.Translator) {
      const floater = document.getElementById('WidgetFloater_uniqueId');
      if (floater) {
        floater.style.display = floater.style.display === 'none' ? 'block' : 'none';
        floater.style.position = 'fixed';
        floater.style.top = '50px';
        floater.style.right = '20px';
        floater.style.zIndex = '1000';
      } else {
        console.log('Translation widget not found');
      }
    } else {
      console.log('Translator not ready yet');
    }
  };

  return (
    <>
      <div 
        onClick={handleTranslate}
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000,
          background: '#4285f4',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Translate
      </div>
      <div id="WidgetFloater_uniqueId" style={{ display: 'none' }}></div>
    </>
  );
};

export default MicrosoftTranslator;