/**
 * Live2D 风格的角色组件
 *
 * 使用多层视差动画 + CSS 变换模拟 Live2D 效果
 * 后续可升级为真正的 Live2D SDK
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export type TeacherEmotion = 'happy' | 'thinking' | 'worried' | 'proud' | 'encouraging' | 'surprised';

// 每种情绪对应的对话
const MESSAGES: Record<TeacherEmotion, string[]> = {
  happy: [
    'すごい！よくできました！',
    'やったね！えらいえらい！',
    'その調子その調子！',
    'perfect！完璧だよ！',
    'すてき！あなたは天才かも！'
  ],
  thinking: [
    'えーっと……そうだね！',
    'ちょっと考えさせて……',
    'なるほどなるほど……',
    'うーん、どうかな？',
    'これは難しいね……'
  ],
  worried: [
    'だいじょうぶ？',
    'もう一回やってみよう！',
    '間違えても全然OK！',
    'ゆっくりでいいよ',
    '僕がついてるから大丈夫'
  ],
  proud: [
    'よくやった！本当に誇らしい！',
    'あなたの成長が見られて嬉しいよ',
    'この調子で次も頑張ろう！',
    '素晴らしい進歩だね！',
    'きっとできると信じてたよ！'
  ],
  encouraging: [
    '今日も頑張ろうね！',
    '一緒に日本語を勉強しよう！',
    '私がついてるから安心して',
    'ファイト！いち、に、さん！',
    'ゆっくりでいいから、自分のペースでね'
  ],
  surprised: [
    'えっ！？',
    'まさか！？',
    'うわぁ！すごい！',
    'へぇ〜！そうなんだ！',
    'びっくりしたなぁ〜'
  ]
};

interface Live2DTeacherProps {
  emotion?: TeacherEmotion;
  customMessage?: string;
  visible?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left';
}

export function Live2DTeacher({
  emotion = 'encouraging',
  customMessage,
  visible = true,
  size = 'md',
  position = 'bottom-right'
}: Live2DTeacherProps) {
  const [currentEmotion, setCurrentEmotion] = useState<TeacherEmotion>(emotion);
  const [currentMessage, setCurrentMessage] = useState(customMessage || getRandomMessage(emotion));
  const [showBubble, setShowBubble] = useState(false);
  const [isBreathing, setIsBreathing] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // 鼠标视差效果
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    setCurrentEmotion(emotion);
    setCurrentMessage(customMessage || getRandomMessage(emotion));
    setShowBubble(true);

    const timer = setTimeout(() => setShowBubble(false), 3000);
    return () => clearTimeout(timer);
  }, [emotion, customMessage]);

  // 鼠标移动视差效果
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / window.innerWidth);
    mouseY.set((e.clientY - centerY) / window.innerHeight);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 获取表情 SVG
  const getFaceSVG = (emo: TeacherEmotion) => {
    const faces = {
      happy: { eyes: '^^', mouth: '▽', blush: true },
      thinking: { eyes: '··', mouth: 'ー', blush: false },
      worried: { eyes: '><', mouth: '▽', blush: true },
      proud: { eyes: '▼ ▼', mouth: '‿', blush: false },
      encouraging: { eyes: '◕ ◕', mouth: '◡', blush: false },
      surprised: { eyes: '○ ○', mouth: '○', blush: false }
    };

    return faces[emo];
  };

  const face = getFaceSVG(currentEmotion);

  // 呼吸动画
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBreathing(b => !b);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const sizeClasses = {
    sm: 'w-40 h-40',
    md: 'w-56 h-56',
    lg: 'w-72 h-72'
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 对话气泡 */}
      <motion.div
        initial={{ scale: 0, y: 20, opacity: 0 }}
        animate={showBubble ? { scale: 1, y: 0, opacity: 1 } : { scale: 0, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-4 max-w-xs"
      >
        <div className="bg-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg border-2 border-pink-200">
          <p className="text-sm font-medium text-gray-700">{currentMessage}</p>
          <div className="absolute -right-2 top-4 w-4 h-4 bg-white border-r-2 border-t-2 border-pink-200 transform rotate-45" />
        </div>
      </motion.div>

      {/* Live2D 风格角色 - 多层视差 */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        style={{
          rotateX: rotateX.get(),
          rotateY: rotateY.get(),
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        animate={
          (currentEmotion === 'happy' || currentEmotion === 'proud') ? {
            y: [0, -8, 0],
          } : {}
        }
        transition={{
          duration: 0.5,
          repeat: (currentEmotion === 'happy' || currentEmotion === 'proud') ? Infinity : 0,
          repeatDelay: 1,
          rotateX: { type: 'spring', stiffness: 300, damping: 30 },
          rotateY: { type: 'spring', stiffness: 300, damping: 30 }
        }}
      >
        {/* 背景光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{ background: 'radial-gradient(circle, #FFB6C1 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* 头发层（后层） */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'translateZ(-20px)' }}
          animate={{
            y: isBreathing ? 0 : 1
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <ellipse cx="100" cy="75" rx="72" ry="62" fill="#FF6B9D" />
          <ellipse cx="100" cy="65" rx="67" ry="52" fill="#FF8BBA" />
        </motion.svg>

        {/* 脸层 */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full drop-shadow-xl"
          style={{ transform: 'translateZ(0px)' }}
          animate={{
            y: isBreathing ? 0 : 1
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          {/* 脸 */}
          <circle cx="100" cy="100" r="50" fill="#FFE4D6" />

          {/* 腮红 */}
          {face.blush && (
            <>
              <motion.circle
                cx="60" cy="110" r="8"
                fill="#FFB6C1"
                opacity={0.6}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.circle
                cx="140" cy="110" r="8"
                fill="#FFB6C1"
                opacity={0.6}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
            </>
          )}

          {/* 眼睛 - 动画效果 */}
          <motion.text
            x="100" y="95"
            textAnchor="middle"
            fontSize="24"
            fill="#333"
            animate={
              currentEmotion === 'thinking' ? {
                opacity: [1, 0.5, 1]
              } : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          >
            {face.eyes}
          </motion.text>

          {/* 嘴巴 */}
          <text
            x="100" y="125"
            textAnchor="middle"
            fontSize="20"
            fill="#FF6B81"
          >
            {face.mouth}
          </text>
        </motion.svg>

        {/* 头饰层（前层） */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* 刘海 */}
          <motion.path
            d="M50 70 Q60 50 70 70 Q80 50 90 70 Q100 50 110 70 Q120 50 130 70 Q140 50 150 70"
            stroke="#FF6B9D"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: currentEmotion === 'surprised'
                ? ['M50 70 Q60 50 70 70 Q80 50 90 70 Q100 50 110 70 Q120 50 130 70 Q140 50 150 70',
                   'M50 65 Q60 45 70 65 Q80 45 90 65 Q100 45 110 65 Q120 45 130 65 Q140 45 150 65']
                : undefined
            }}
            transition={{ duration: 0.3 }}
          />

          {/* 蝴蝶结 */}
          <g transform="translate(140, 50)">
            <ellipse cx="0" cy="0" rx="15" ry="10" fill="#FFD700" />
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#FFA500" />
            <motion.circle
              cx="0" cy="0" r="3" fill="#FFF"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </g>

          {/* 闪亮效果 */}
          {currentEmotion === 'happy' || currentEmotion === 'proud' || currentEmotion === 'surprised' ? (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <circle cx="130" cy="60" r="4" fill="#FFD700" opacity="0.8" />
              <path d="M130 60 L125 65 M130 60 L135 65 M130 60 L130 55" stroke="#FFD700" strokeWidth="1" />
            </motion.g>
          ) : null}
        </svg>

        {/* 名字标签 */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          さくら先生
        </div>
      </motion.div>
    </motion.div>
  );
}

function getRandomMessage(emotion: TeacherEmotion): string {
  const messages = MESSAGES[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
}

// 情绪触发器
export const TeacherTriggers = {
  correct: () => {
    const options: TeacherEmotion[] = ['happy', 'proud', 'surprised'];
    return options[Math.floor(Math.random() * options.length)];
  },
  wrong: () => {
    const options: TeacherEmotion[] = ['worried', 'encouraging'];
    return options[Math.floor(Math.random() * options.length)];
  },
  start: () => 'encouraging' as TeacherEmotion,
  complete: () => 'proud' as TeacherEmotion,
  stuck: () => 'thinking' as TeacherEmotion
};
