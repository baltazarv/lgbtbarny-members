import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const colorsOptions = [
  // { backgroundColor: '#e6fffb', color: '#006d75' }, // cyan
  { backgroundColor: '#fcffe6', color: '#3f6600' }, // green
  { backgroundColor: '#feffe6', color: '#ad8b00' }, // yellow
  { backgroundColor: '#f9f0ff', color: '#531dab' }, // purple
  { backgroundColor: '#f9f0ff', color: '#9e1068' }, // magenta
]

const Banner = ({ title, text, colors }) => {

  const [colorStyles, setColorStyles] = useState({});

  useEffect(() => {
    const randomArrayValue = (array) => {
      return array[Math.floor(Math.random() * array.length)];
    }
    if (colors) {
      setColorStyles(colors);
    } else {
      setColorStyles(randomArrayValue(colorsOptions));
    }
  }, [colors]);

  return (
    <>
      <Card.Header className="card-banner" style={colorStyles}>
        {title &&
          <div className="title">{title}</div>
        }
        {text &&
          <div className="text">{text}</div>
        }
      </Card.Header>
      <style jsx global>{`
        .card-banner {
          text-align: center;
        }
        .card-banner .title {
          font-weight: bold;
          font-size: 1.5em;
        }
        .card-banner .text {
          font-size: 0.9em
        }
      `}</style>
    </>
  )
}

export default Banner;
