import { Card } from 'react-bootstrap';
// TO-DO: add random pastel background color

const Banner = ({title, text}) => {
  return (
    <>
      <Card.Header className="card-banner">
        {/* blah */}
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
