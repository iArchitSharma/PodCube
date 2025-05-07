
const Loader = () => {
    return (
      <div>
        <svg className="loader" viewBox="0 0 100 100">
          <circle className="circle circle1" cx="50" cy="50" r="10"></circle>
          <circle className="circle circle2" cx="50" cy="50" r="20"></circle>
          <circle className="circle circle3" cx="50" cy="50" r="30"></circle>
          <circle className="circle circle4" cx="50" cy="50" r="40"></circle>
        </svg>
        
        <style jsx>{`
          
          .loader {
            position: relative;
            width: 120px;
            height: 120px;
          }
          .circle {
            fill: none;
            stroke-width: 4;
            stroke-linecap: round;
            stroke-dasharray: 0, 314;
            animation: draw 2s ease-in-out infinite;
            transform-origin: center;
          }
          .circle1 {
            stroke: cyan;
            animation-delay: 0s;
          }
          .circle2 {
            stroke: magenta;
            animation-delay: 0.4s;
          }
          .circle3 {
            stroke: lime;
            animation-delay: 0.8s;
          }
          .circle4 {
            stroke: orange;
            animation-delay: 1.2s;
          }
          @keyframes draw {
            0% {
              stroke-dasharray: 0, 314;
              opacity: 0.2;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
            }
            100% {
              stroke-dasharray: 314, 314;
              opacity: 0.2;
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default Loader;