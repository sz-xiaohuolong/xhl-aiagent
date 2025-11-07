<template>
  <div class="chat-container">
    <div class="chat-header">
      <button class="back-btn" @click="goHome">← 返回</button>
      <h2>AI 超级智能体</h2>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-content">
          <div class="message-avatar">
            {{ message.role === "user" ? "👤" : "🤖" }}
          </div>
          <div class="message-text">
            <div class="message-role">
              {{ message.role === "user" ? "你" : "AI超级智能体" }}
            </div>
            <div class="message-body">{{ message.content }}</div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="message ai">
        <div class="message-content">
          <div class="message-avatar">🤖</div>
          <div class="message-text">
            <div class="message-role">AI超级智能体</div>
            <div class="message-body typing">正在输入...</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        :disabled="isLoading"
        class="chat-input"
        placeholder="输入您的问题..."
        type="text"
      />
      <button
        @click="sendMessage"
        :disabled="isLoading || !inputMessage.trim()"
        class="send-btn"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { createSSEConnectionWithAxios } from "../utils/sse";

const router = useRouter();
const messages = ref([]);
const inputMessage = ref("");
const isLoading = ref(false);
const messagesContainer = ref(null);
let abortController = null;

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim() || isLoading.value) {
    return;
  }

  const userMessage = inputMessage.value.trim();
  inputMessage.value = "";

  // 添加用户消息
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  scrollToBottom();

  // 添加AI消息占位符
  const aiMessageIndex = messages.value.length;
  messages.value.push({
    role: "ai",
    content: "",
  });

  isLoading.value = true;

  // 取消之前的请求
  if (abortController) {
    abortController.abort();
  }

  // 创建SSE连接（使用fetch方式，因为后端返回的是SseEmitter）
  const baseURL = "http://localhost:8123/api";
  abortController = createSSEConnectionWithAxios(
    `${baseURL}/ai/manus/chat`,
    {
      message: userMessage,
    },
    (data) => {
      // 实时更新AI消息
      if (messages.value[aiMessageIndex]) {
        messages.value[aiMessageIndex].content += data;
        scrollToBottom();
      }
    },
    (error) => {
      console.error("SSE Error:", error);
      isLoading.value = false;
      if (messages.value[aiMessageIndex]) {
        if (error.name !== "AbortError") {
          messages.value[aiMessageIndex].content = "抱歉，发生了错误，请重试。";
        }
      }
    },
    () => {
      // 流结束
      isLoading.value = false;
    }
  );
};

// 返回主页
const goHome = () => {
  if (abortController) {
    abortController.abort();
  }
  router.push("/");
};

// 初始化
onMounted(() => {
  // 可以在这里发送欢迎消息
  messages.value.push({
    role: "ai",
    content: "您好！我是AI超级智能体，有什么问题可以问我哦~",
  });
});

// 清理
onUnmounted(() => {
  if (abortController) {
    abortController.abort();
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.chat-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  width: 100%;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-content {
  display: flex;
  gap: 10px;
  max-width: 70%;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  flex: 1;
}

.message-role {
  font-size: 12px;
  color: #999;
  padding: 0 5px;
}

.message-body {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
  max-width: 100%;
  overflow: hidden;
}

.message.user .message-body {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.message.ai .message-body {
  background: white;
  color: #333;
}

.typing {
  color: #999;
  font-style: italic;
}

.chat-input-container {
  background: white;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input:focus {
  border-color: #f5576c;
}

.chat-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.3s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
