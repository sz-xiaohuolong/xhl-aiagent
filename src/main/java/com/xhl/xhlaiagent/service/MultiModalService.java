package com.xhl.xhlaiagent.service;

import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversation;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationParam;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.dashscope.common.MultiModalMessage;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
public class MultiModalService {

    public String analyzeImageWithText(String imageUrl, String text) {
        try {
            MultiModalConversation conv = new MultiModalConversation();

            MultiModalMessage userMessage = MultiModalMessage.builder().role("user")
                    .content(Arrays.asList(
                            Collections.singletonMap("image", imageUrl),
                            Collections.singletonMap("text", text)
                    )).build();

            MultiModalConversationParam param = MultiModalConversationParam.builder()
                    .apiKey(System.getenv("Bailian_API_KEY"))
                    .model("qwen-vl-plus")
                    .message(userMessage)
                    .build();

            MultiModalConversationResult result = conv.call(param);
            return result.getOutput().toString();
        } catch (Exception e) {
            return "图片识别失败，请换一张试试～";
        }
    }
}
