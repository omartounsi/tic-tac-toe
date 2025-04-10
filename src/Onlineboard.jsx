import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";

const socket = io("http://localhost:3002");

const OnlineBoard = ({ roomId, setOption }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [transitionBg, setTransitionBg] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // join
    socket.emit("joinRoom", roomId);
    console.log("joining room:", roomId);

    // gameupdates
    socket.on("updateGame", (gameState) => {
      console.log("GAME UPDATE", gameState);

      setBoard(gameState.board);
      setIsXNext(gameState.isXNext);
    });

    // gameover
    socket.on("gameOver", ({ winner }) => {
      console.log("GAME OVER");
      setWinner(winner);
    });

    return () => {
      socket.off("connect");
      socket.off("updateGame");
      socket.off("gameOver");
    };
  }, [roomId]);

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

  function handleTurn(index) {
    if (!board[index] && !winner) {
      socket.emit("makeMove", { roomId, index });
      console.log("move sent");
    }
  }

  function handleBack() {
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

export default OnlineBoard;
