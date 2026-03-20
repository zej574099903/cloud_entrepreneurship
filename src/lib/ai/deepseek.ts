import OpenAI from 'openai';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

if (!DEEPSEEK_API_KEY) {
  console.warn('DEEPSEEK_API_KEY is not defined in .env.local. AI advice will be disabled.');
}

const openai = new OpenAI({
  apiKey: DEEPSEEK_API_KEY || 'dummy_key',
  baseURL: DEEPSEEK_BASE_URL,
});

/**
 * AI Assistant to interpret algorithm results and provide advice.
 * This follows the "Algorithm-First" philosophy.
 */
export async function getEntrepreneurAdvice(
  categoryName: string,
  simulationResults: any,
  userScenario?: string
) {
  if (!DEEPSEEK_API_KEY) return 'AI 建议暂时不可用，请配置 API Key。';

  const prompt = `
    你是一位资深的创业导师。我们刚刚为一个名为“${categoryName}”的项目运行了数学模拟仿真。
    以下是确定的计算结果：
    - 净利润预估: ${simulationResults.netProfit}
    - 投资回报率: ${simulationResults.roi * 100}%
    - 营收状况: ${simulationResults.revenue}
    
    用户当前场景: ${userScenario || '常规模拟'}

    请根据这些数字，给出 3 条非常具体、人性化、具有实操性的建议。
    不要空谈，要针对如何提高转化率、降低损耗或调整价格给出指导。
    回复语言：中文。
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // or use deepseek-reasoner for advanced logic
      messages: [
        { role: 'system', content: '你是一位注重数据、实操性极强的创业分析师。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return '生成建议时遇到一点问题，请稍后再试。';
  }
}
