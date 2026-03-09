/**
 * TeacherCharacter - 萌妹子日语老师
 *
 * 可爱的立绘老师，陪伴学生学习日语
 * 根据学习进度切换表情和鼓励语
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 老师的情绪状态
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

interface TeacherCharacterProps {
  /** 当前情绪 */
  emotion?: TeacherEmotion;
  /** 自定义消息（覆盖默认） */
  customMessage?: string;
  /** 是否显示 */
  visible?: boolean;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 位置 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function TeacherCharacter({
  emotion = 'encouraging',
  customMessage,
  visible = true,
  size = 'md',
  position = 'bottom-right'
}: TeacherCharacterProps) {
  const [currentEmotion, setCurrentEmotion] = useState<TeacherEmotion>(emotion);
  const [currentMessage, setCurrentMessage] = useState<string>(
    customMessage || getRandomMessage(emotion)
  );
  const [showBubble, setShowBubble] = useState(false);

  // 当情绪变化时更新
  useEffect(() => {
    setCurrentEmotion(emotion);
    setCurrentMessage(customMessage || getRandomMessage(emotion));
    setShowBubble(true);

    // 3秒后隐藏气泡
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [emotion, customMessage]);

  // 根据情绪获取 SVG 立绘（临时使用 SVG，后续可替换为 PNG）
  const getTeacherSVG = (emo: TeacherEmotion) => {
    // 表情对应的眼睛和嘴巴
    const faces = {
      happy: { eyes: '^^', mouth: '▽' },
      thinking: { eyes: '··', mouth: 'ー' },
      worried: { eyes: '><', mouth: '▽' },
      proud: { eyes: '▼ ▼', mouth: '‿' },
      encouraging: { eyes: '◕ ◕', mouth: '◡' },
      surprised: { eyes: '○ ○', mouth: '○' }
    };

    const face = faces[emo];

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* 头发 */}
        <ellipse cx="100" cy="80" rx="70" ry="60" fill="#FF6B9D" />
        <ellipse cx="100" cy="70" rx="65" ry="50" fill="#FF8BBA" />

        {/* 脸 */}
        <circle cx="100" cy="100" r="50" fill="#FFE4D6" />

        {/* 腮红 */}
        <circle cx="60" cy="110" r="8" fill="#FFB6C1" opacity="0.6" />
        <circle cx="140" cy="110" r="8" fill="#FFB6C1" opacity="0.6" />

        {/* 眼睛 */}
        <text x="100" y="95" textAnchor="middle" fontSize="24" fill="#333">
          {face.eyes}
        </text>

        {/* 嘴巴 */}
        <text x="100" y="125" textAnchor="middle" fontSize="20" fill="#FF6B81">
          {face.mouth}
        </text>

        {/* 刘海 */}
        <path d="M50 70 Q60 50 70 70 Q80 50 90 70 Q100 50 110 70 Q120 50 130 70 Q140 50 150 70"
              stroke="#FF6B9D" strokeWidth="8" fill="none" strokeLinecap="round"/>

        {/* 头饰（蝴蝶结） */}
        <g transform="translate(140, 50)">
          <ellipse cx="0" cy="0" rx="15" ry="10" fill="#FFD700" />
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#FFA500" />
        </g>
      </svg>
    );
  };

  // 位置样式
  const positionStyles: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // 大小样式
  const sizeStyles = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed ${positionStyles[position]} z-50 flex flex-col items-end`}
    >
      {/* 对话气泡 */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-4 max-w-xs"
          >
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg border-2 border-pink-200">
              <p className="text-sm font-medium text-gray-700">{currentMessage}</p>
              {/* 气泡小尾巴 */}
              <div className="absolute -right-2 top-4 w-4 h-4 bg-white border-r-2 border-t-2 border-pink-200 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 立绘容器 */}
      <motion.div
        animate={currentEmotion === 'happy' || currentEmotion === 'proud' ? {
          y: [0, -10, 0],
          rotate: [0, -5, 5, -5, 0]
        } : {}}
        transition={{
          duration: 0.5,
          repeat: currentEmotion === 'happy' || currentEmotion === 'proud' ? Infinity : 0,
          repeatDelay: 1
        }}
        className={`${sizeStyles[size]} drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer`}
        onClick={() => {
          // 点击老师时随机说句话
          const randomEmotion = getRandomEmotion();
          setCurrentEmotion(randomEmotion);
          setCurrentMessage(getRandomMessage(randomEmotion));
          setShowBubble(true);
          setTimeout(() => setShowBubble(false), 3000);
        }}
      >
        {getTeacherSVG(currentEmotion)}
      </motion.div>

      {/* 名字标签 */}
      <div className="absolute bottom-2 left-2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
        さくら先生
      </div>
    </motion.div>
  );
}

// 辅助函数：获取随机消息
function getRandomMessage(emotion: TeacherEmotion): string {
  const messages = MESSAGES[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
}

// 辅助函数：获取随机情绪
export function getRandomEmotion(): TeacherEmotion {
  const emotions: TeacherEmotion[] = ['happy', 'encouraging', 'proud', 'surprised'];
  return emotions[Math.floor(Math.random() * emotions.length)];
}

// 预设的情绪切换触发器
export const TeacherTriggers = {
  // 答对题目时
  correct: () => {
    const options: TeacherEmotion[] = ['happy', 'proud', 'surprised'];
    return options[Math.floor(Math.random() * options.length)];
  },

  // 答错题目时
  wrong: () => {
    const options: TeacherEmotion[] = ['worried', 'encouraging'];
    return options[Math.floor(Math.random() * options.length)];
  },

  // 开始学习时
  start: () => 'encouraging' as TeacherEmotion,

  // 完成课程时
  complete: () => 'proud' as TeacherEmotion,

  // 遇到困难时
  stuck: () => 'thinking' as TeacherEmotion
};
