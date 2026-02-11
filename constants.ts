import { TestCase } from './types';

// ==========================================
// 1. 引入本地图片
// (确保你已经把 pic 文件夹拖到了 src 文件夹里面)
// ==========================================
import case1 from './pic/case1.png';
import case1Ref from './pic/case1_ref.png';
import case1Def from './pic/case1_def.png';
import case2 from './pic/case2.png';
import case2Def from './pic/case2_def.png';
import case2Ref from './pic/case2_ref.png';
import case3 from './pic/case3.png';
import case3Def from './pic/case3_def.png';
import case3Ref from './pic/case3_ref.png';
// 如果你有 case4，也可以解开下面的注释
import case4 from './pic/case4.png';
import case4Def from './pic/case4_def.png';
import case4Ref from './pic/case4_ref.png';

export const TEST_CASES: TestCase[] = [
  {
    id: 1,
    name: "Case #001",
    description: "对称布线差分对",
    // 这里不再是 URL 字符串，而是上面 import 进来的图片变量
    imageSrc: case1, 
    defectSrc:case1Def,
    referenceSrc: case1Ref
  },
  {
    id: 2,
    name: "Case #002",
    description: "对称布线差分对",
    imageSrc: case2,
    defectSrc:case2Def,
    referenceSrc: case2Ref
  },
  {
    id: 3,
    name: "Case #003",
    description: "对称布线差分对",
    imageSrc: case3,
    defectSrc:case3Def,
    referenceSrc: case3Ref
  },
  // 如果你想加第4个案例，就把这段加进去
  {
    id: 4,
    name: "Case #004",
    description: "对称布线差分对",
    imageSrc: case4,
    defectSrc:case4Def,
    referenceSrc: case4Ref
  }
];

export const SYSTEM_PROMPT = `你是一位资深的 PCB 设计专家和 QA 工程师。
你的任务是分析 PCB（印制电路板）图像中的制造缺陷。
重点关注区域：
1. 短路（走线/焊盘之间不必要的连接）
2. 开路（走线断裂）
3. 线距/间隙违规（走线太近）

请分析提供的图像。如果你看到缺陷，请描述其位置和严重程度。
请注意：**你的回答必须非常简练，严格控制在3句话以内。不要废话。**
使用中文回答。`;