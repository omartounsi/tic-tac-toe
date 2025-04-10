import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
  easeIn,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { button, div, p } from "framer-motion/client";

import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

import { FaRegCircle } from "react-icons/fa";
import OnlineBoard from "./Onlineboard";

const App = () => {
  const lenis = new Lenis({
    autoRaf: true,
  });

  // const container = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start start", "end end"],
  // });

  const list = [
    { id: 1, label: "Play vs Computer" },
    { id: 2, label: "Play online" },
  ];
  const [active, setActive] = useState(list[0].id);
  const [showNav, setShowNav] = useState(false);
  const [option, setOption] = useState(0);

  return (
    <div className="h-screen bg-neutral-900 flex justify-center items-center flex-col">
      {/* Menu */}
      <AnimatePresence>
        {option === 0 && (
          <motion.div className="grid place-self-center" exit={{ opacity: 0 }}>
            <motion.button
              initial={{
                scale: 0.4,
              }}
              animate={{
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 10,
                  stiffness: 200,
                },
              }}
              layout
              layoutId=""
              className="text-violet-200 font-[Quicksand] text-lg outline-1 rounded-full py-3 px-2 mb-5 hover:text-violet-900 hover:bg-violet-200 transition-colors"
              onClick={() => setShowNav(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {!showNav ? "Tic Tac Toe" : "Choose"}
            </motion.button>
            <AnimatePresence mode="wait">
              {showNav && (
                <>
                  <motion.nav
                    key={"testkey"}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {list.map((item) => (
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                        }}
                        onClick={() => setActive(item.id)}
                        className="relative text-neutral-100 font-[Quicksand] rounded-full text-sm py-3 px-1.5 mx-1 "
                        key={item.id}
                      >
                        {active === item.id && (
                          <motion.div
                            layoutId="active-tab"
                            className="bg-neutral-100 absolute inset-0"
                            style={{ borderRadius: 9999 }}
                            transition={{ duration: 0.8, type: "spring" }}
                          />
                        )}
                        <span className="relative z-10 mix-blend-exclusion">
                          {item.label}
                        </span>
                      </motion.button>
                    ))}
                  </motion.nav>
                  <motion.button
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOption(active)}
                    className="text-neutral-900 p-2 grid place-self-center text-2xl bg-neutral-100 rounded-full mt-3 opacity-30"
                  >
                    <FaCheck />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      {option === 1 && <Board setShowNav={setShowNav} setOption={setOption} />}
      {option === 2 && <OnlineBoard roomId="room1" setOption={setOption} />}
    </div>

    // <main ref={container} className="h-[200vh] relative scroll-smooth">
    //   <Section1 scrollYProgress={scrollYProgress}/>
    //   <Section2 scrollYProgress={scrollYProgress}/>
    // </main>
  );
};

const Board = ({ setOption }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [transitionBg, setTransitionBg] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setTransitionBg(true);
    }, 2000);
    return () => clearTimeout(id);
  }, []);

  const COLORS = [
    "bg-violet-100",
    "bg-violet-200",
    "bg-violet-300",
    "bg-violet-400",
    "bg-violet-500",
    "bg-violet-600",
    "bg-violet-700",
    "bg-violet-800",
    "bg-violet-900",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
    },
  };

  const cellVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
      },
    },
  };

  const winningIndex = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin(board) {
    for (let combination of winningIndex) {
      let [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function handleTurn(index) {
    if (board[index]) return; //cell already filled
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // console.log(newBoard); //test/

    const gameWinner = checkWin(newBoard);
    console.log(gameWinner);
    if (gameWinner) {
      setWinner(gameWinner);
      setMenu(true);
    }
  }

  function restart() {
    setMenu(false);
    setWinner(null);
    setBoard(Array(9).fill(null));
  }

  function handleBack() {
    setIsVisible(false);
    setOption(0);
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!winner && (
          <motion.div className="h-auto">
            <motion.button
              key="back-button"
              onClick={handleBack}
              initial={{ opacity: 0, y: -200, scale: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  delay: 1,
                  duration: 1.2,
                  type: "spring",
                },
              }}
              layoutId="back"
              className="w-full text-violet-200 font-[Quicksand] text-lg outline-1 rounded-full py-3 px-2 mb-5 hover:text-violet-900 hover:bg-violet-200 transition-colors"
            >
              Back
            </motion.button>
            <motion.div
              layout
              layoutId="back"
              initial="hidden"
              animate={isVisible ? "show" : "hidden"}
              variants={containerVariants}
              exit={{
                opacity: 0,
                scale: 0.4,
                transition: {
                  duration: 0.2,
                },
              }}
              className="w-120 h-120 bg-200 grid grid-cols-3 grid-rows-3 gap-2"
            >
              {COLORS.map((color, index) => (
                <motion.div
                  key={index}
                  className={`transition-colors duration-1500 ease-in-out ${color} rounded-md outline-1 outline-neutral-800 grid place-items-center`}
                  onClick={() => handleTurn(index)}
                  variants={cellVariants}
                  style={{
                    backgroundColor: transitionBg ? "#282b2e" : "",
                  }}
                  whileHover={{
                    scale: 1.05,
                    filter: "brightness(2)",
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <motion.span className="text-6xl">
                    {board[index] === "X" ? (
                      <motion.div
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <MdClose className="text-[80px] text-violet-600" />
                      </motion.div>
                    ) : board[index] === "O" ? (
                      <motion.div
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <FaRegCircle className="text-[60px] text-red-500" />
                      </motion.div>
                    ) : (
                      ""
                    )}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {menu && (
          <>
            <div className="text-neutral-200 text-4xl font-[Quicksand] mb-4">
              {checkWin(board) === "X" ? (
                <div>
                  <span className="text-violet-600">X</span> won.
                </div>
              ) : (
                <div>
                  <span className="text-red-500">O</span> won.
                </div>
              )}
            </div>
            <motion.button
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              onClick={restart}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
              className="text-neutral-200 font-[Quicksand] outline-1 outline-violet-300 rounded-full px-4 py-1.5 hover:text-violet-900 hover:bg-violet-200"
            >
              Restart?
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Section1 = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      style={{
        scale,
        rotate,
      }}
      className="sticky top-0 h-screen bg-red-500 flex justify-center items-center"
    >
      <p className="text-xl font-[Quicksand] text-neutral-100">scroll me</p>
    </motion.div>
  );
};

const Section2 = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 0]);

  return (
    <motion.div
      style={{
        scale,
        rotate,
      }}
      className="relative h-screen bg-violet-600 flex justify-center items-center"
    >
      <p className="text-xl font-[Quicksand] text-neutral-100">hi</p>
    </motion.div>
  );
};

export default App;
