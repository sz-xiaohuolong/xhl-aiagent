/**
 * 创建SSE连接（使用fetch，完全控制连接，不会自动重连）
 * 直接处理流数据，不依赖SSE格式标志
 * @param {string} url - SSE接口地址
 * @param {Object} params - 请求参数
 * @param {Function} onMessage - 消息回调函数
 * @param {Function} onError - 错误回调函数
 * @param {Function} onComplete - 流结束回调函数
 * @returns {AbortController} AbortController实例，用于取消请求
 */
export function createSSEConnection(
  url,
  params,
  onMessage,
  onError,
  onComplete
) {
  const controller = new AbortController();

  fetch(`${url}?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
    },
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      function readStream() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              // 处理剩余的buffer
              if (buffer) {
                // 直接处理所有内容，去掉SSE格式包装
                const content = buffer
                  .replace(/^data:\s*/gm, "")
                  .replace(/^\s*:\s*/gm, "");
                if (content.trim() && onMessage) {
                  onMessage(content.trim());
                }
              }
              // 流结束
              if (onComplete) {
                onComplete();
              }
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            // 按行处理，实时发送内容
            while (buffer.includes("\n")) {
              const index = buffer.indexOf("\n");
              let line = buffer.substring(0, index);
              buffer = buffer.substring(index + 1);

              // 去掉SSE格式前缀（如果存在）
              line = line.replace(/^data:\s*/, "").replace(/^\s*:\s*/, "");

              // 跳过空行和注释行
              if (line.trim() && onMessage) {
                onMessage(line.trim());
              }
            }

            readStream();
          })
          .catch((error) => {
            if (error.name !== "AbortError" && onError) {
              onError(error);
            }
          });
      }

      readStream();
    })
    .catch((error) => {
      if (error.name !== "AbortError" && onError) {
        onError(error);
      }
    });

  return controller;
}

/**
 * 创建SSE连接（使用fetch，适用于SseEmitter）
 * @param {string} url - SSE接口地址
 * @param {Object} params - 请求参数
 * @param {Function} onMessage - 消息回调函数
 * @param {Function} onError - 错误回调函数
 * @param {Function} onComplete - 流结束回调函数
 * @returns {AbortController} AbortController实例，用于取消请求
 */
export function createSSEConnectionWithAxios(
  url,
  params,
  onMessage,
  onError,
  onComplete
) {
  const controller = new AbortController();

  fetch(`${url}?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
    },
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      function readStream() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              // 处理剩余的buffer
              if (buffer) {
                // 直接处理所有内容，去掉SSE格式包装
                const content = buffer
                  .replace(/^data:\s*/gm, "")
                  .replace(/^\s*:\s*/gm, "");
                if (content.trim() && onMessage) {
                  onMessage(content.trim());
                }
              }
              // 流结束
              if (onComplete) {
                onComplete();
              }
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            // 按行处理，实时发送内容
            while (buffer.includes("\n")) {
              const index = buffer.indexOf("\n");
              let line = buffer.substring(0, index);
              buffer = buffer.substring(index + 1);

              // 去掉SSE格式前缀（如果存在）
              line = line.replace(/^data:\s*/, "").replace(/^\s*:\s*/, "");

              // 跳过空行和注释行
              if (line.trim() && onMessage) {
                onMessage(line.trim());
              }
            }

            readStream();
          })
          .catch((error) => {
            if (error.name !== "AbortError" && onError) {
              onError(error);
            }
          });
      }

      readStream();
    })
    .catch((error) => {
      if (error.name !== "AbortError" && onError) {
        onError(error);
      }
    });

  return controller;
}
