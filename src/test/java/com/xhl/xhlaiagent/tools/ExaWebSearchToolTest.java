package com.xhl.xhlaiagent.tools;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.UnsupportedEncodingException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ExaWebSearchToolTest {

    @Value("${exa.api-key}")
    private String searchApiKey;

    @Test
    public void testSearchWeb() throws UnsupportedEncodingException {
        ExaWebSearchTool tool = new ExaWebSearchTool(searchApiKey);
        String query = "程序员鱼皮编程导航 codefather.cn";
        String result = tool.exaSearch(query);
        System.out.println(result);
        assertNotNull(result);
    }
}