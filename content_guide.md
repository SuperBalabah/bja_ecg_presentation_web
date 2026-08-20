# 🫀 BJA 2025 ECG-MACE 深度學習麻醉科晨會簡報完整內容指南

> **報告場合**：麻醉部晨會 (Department of Anesthesiology Morning Meeting)  
> **講　　者**：UGY 謝一陽  
> **指　　導**：VS 周韋翰 醫師 / CR 李孟柔 醫師  
> **論文題目**：*Preoperative risk prediction of major cardiovascular events in noncardiac surgery using the 12-lead electrocardiogram: an explainable deep learning approach* (*British Journal of Anaesthesia*, 2025)

---

## 📑 簡報章節全景導覽 (Presentation Blueprint)

```
[ Part 1: 寫程式 vs. 機器學習 (尋寶與漏斗) ]
                  │
                  ▼
[ Part 2: 機器學習三大主流學習方式 (考古題 / 分群 / 試錯獎懲) ]
                  │
                  ▼
[ Part 3: 傳統 ML 的痛點 ➔ DL 定義 ➔ 1D-CNN 原理 (皮卡丘 vs. CVC 梗圖) ]
                  │
                  ▼
[ Part 4: 本論文模型架構與選用理由 (1D-ResNet 保底旁路 + MLP 晚期融合 + 反向傳播) ]
                  │
                  ▼
[ Part 5: 破解黑盒子：反事實可解釋性 (XAI 原理、電生理發現 ＆ 方法學限制與批判思考) ]
                  │
                  ▼
[ Part 6: 成果對比 (本模型 vs. 傳統 RCRI) 與麻醉臨床決策價值 ]
```

---

## 🌟 Part 1: 寫程式 vs. 機器學習：思維的典範轉移

### 1. 經典尋寶比喻 (Treasure Hunt Metaphor)
* **傳統程式 (Classical Programming / Rule-Based)**：
  * 人類工程師在地上鋪設好一條固定石板步道（寫死的 `if-else` 規則，如：ST 壓低 > 1mm 就亮紅燈）。
  * 電腦只要照著鋪好的路線走，就能到達終點（Results）。
* **機器學習 (Machine Learning)**：
  * 我們給電腦起點地圖（歷史數據 Data）與寶藏終點（目標標籤 Goal / Labels，如術後有無心肌梗塞）。
  * 中間的路徑是一個**巨大的問號（？）**，電腦必須透過成千上萬次的嘗試錯誤（Trial & Error）與參數修正，**自己學出通往寶藏的最佳規則（Program / Model Weights）**。

### 2. 經典漏斗圖架構 (Paradigm Shift)
* **傳統程式**：$\text{輸入資料 (Input)} + \text{人寫好的程式規則 (Program)} \longrightarrow \mathbf{\text{輸出結果 (Results)}}$
* **機器學習**：$\text{輸入資料 (Data)} + \text{目標答案 (Goal / Labels)} \longrightarrow \mathbf{\text{自己學出的模型規則 (Program / Model)}}$

### 3. 引用資源與出處
* **尋寶比喻插圖**：[`assets/ml_vs_programming_treasure.jpg`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/ml_vs_programming_treasure.jpg)
* **經典漏斗圖**：[`assets/classic_funnel_paradigm.jpg`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/classic_funnel_paradigm.jpg)（出處：[Bing Content](https://tse4.mm.bing.net/th/id/OIP.79oDz0vw4TiG7DjXA18CAgHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3)）

---

## 🧠 Part 2: 機器學習的三大主流學習方式 (Main ML Learning Paradigms)

#### 1. 總論架構對照 (Top Overview - 兩大經典圖表並列)
1. **三大學習方式架構流程圖 (Input ➔ Learning ➔ Output)**：
   * 本地檔案：[`assets/ml_types_comparison.png`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/ml_types_comparison.png)
   * 來源出處：[TheAIOps / GeeksforGeeks](https://www.theaiops.com/wp-content/uploads/2024/08/image-30-1024x523.png)
2. **三大任務手繪直覺對比圖 (Clustering / Boundary / Policy)**：
   * 本地檔案：[`assets/ml_types_handdrawn.webp`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/ml_types_handdrawn.webp)
   * 來源出處：[Medium - Machine Learning Types](https://miro.medium.com/v2/resize:fit:1025/1*phWriU47q3GKM6hKbUQ-4g.webp)

#### 2. 分項詳細說明 (Bottom Tabs - 互動切換說明欄)
* **A. 監督式學習 (Supervised Learning) ★【本篇論文採用】**
  * **Input**：有標籤資料（Data With Labels, 題目 <var>X</var> + 答案 <var>Y</var>）。
  * **學習機制**：比對預測與 Target 的 Error 進行梯度修正，在特徵空間劃出分類決策邊界（Decision Boundary）或回歸擬合。
  * **代表演算法**：XGBoost、Random Forest、Logistic Regression、SVM、1D-CNN / 1D-ResNet
  * **臨床麻醉實例**：術前抽血指數預測 AKI；**本文：12 導程 ECG 原始連續波形預測術後 MACE 心血管事件**。

* **B. 非監督式學習 (Unsupervised Learning)**
  * **Input**：無標籤資料（Data Without Labels, 只有 <var>X</var> 沒有 <var>Y</var>）。
  * **學習機制**：電腦自行動態探索資料特徵的聚集形態，輸出群集（Clusters）或降維。
  * **代表演算法**：K-Means、PCA、t-SNE、UMAP、階層式分群
  * **臨床麻醉實例**：給 1 萬筆 ICU 敗血症病患生理指數，自動歸納聚類出三大未知亞型 (Phenotyping)。

* **C. 強化學習 (Reinforcement Learning)**
  * **Input**：狀態與動作（States + Actions）。
  * **學習機制**：智能體（Agent）在環境中試錯，依據回饋評估（Rewards $R=+1/-5$）學會最佳動態策略。
  * **代表演算法**：Q-Learning、DQN、PPO、Actor-Critic
  * **臨床麻醉實例**：ICU 升壓劑/輸液智慧調控 (AI Clinician)；TIVA 麻醉深度閉環自動輸注。

---

## 💡 Part 3: 傳統 ML 的痛點 ➔ 深度學習 (DL) 定義 ➔ 卷積神經網路 (CNN)

### 1. 傳統機器學習的致命痛點：人工特徵工程 (Feature Engineering)
* **痛點解說**：傳統 ML（如 XGBoost、Logistic Regression）無法直接處理連續高頻波形，必須由人類醫師手動量測特徵（如：手動量 PR interval、QRS 寬度、ST 壓低幾毫米）。
* **「我是誰？皮卡丘 vs. CVC 梗圖」帶來的反思**：
  * **黑影題目（左圖）**：[`assets/pikachu_shadow.png`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/pikachu_shadow.png)
  * **答案揭曉（右圖）**：[`assets/cvc_pikachu_meme.jpg`](file:///c:/Users/USER/finished_works/Early_meeting_too_early_zzz/bja_ecg_presentation_web/assets/cvc_pikachu_meme.jpg)（硬塞在皮卡丘外輪廓裡的 **CVC 中央靜脈導管置入圖**！）
  * **臨床寓意**：如果只依賴人類預先定義的粗糙外框特徵（就像只看黑影輪廓就斷定是皮卡丘），我們就會被表面特徵蒙蔽，完全漏掉內部真正複雜的病理結構！

### 2. 深度學習 (Deep Learning, DL) 的通用定義：端到端表徵學習
* **定義**：深度學習是機器學習的子領域，利用**多層人工神經網路**直接從原始資料（Raw Data）中自動學習抽象表徵（Representation Learning），徹底擺脫人類手動設計特徵的限制。

### 3. 卷積神經網路 (CNN) 與 1D-CNN 原理
* **核心機制**：卷積核（Filter）就像一個**鉛直滑動放大鏡**，沿著 10 秒心電圖的時間軸（第 0 秒掃到第 10 秒）一路掃描。
* **由淺入深的抽取機制**：
  * **淺層卷積**：捕捉極短時間內的微細電壓斜率（Slope）與急遽轉折。
  * **中層卷積**：組合成局部的 P 波、QRS 複合波、ST-T 段形態。
  * **深層卷積**：整合 12 導程的空間向量，提煉出全局電生理病理（前壁/下壁缺血、傳導阻滯）。
* **兩大超能力**：
  1. **局部感受野 (Local Receptive Fields)**：專注捕捉局部波形特徵。
  2. **平移不變性 (Translation Invariance)**：異常波形無論出現在第 2 秒還是第 8 秒，都能精準識別。

---

## 🔬 Part 4: 本論文模型架構與選用理由 (Architecture & Rationale)

### 1. 雙支線資料型態與 I/O 拆解
本研究採用**「監督式多模態深度學習」**，模擬兩位專科 AI 協同會診：

```
【支線 1：心電圖專科 AI (1D-ResNet)】
  • Input (I)  : 10 秒 12 導程原始連續電壓矩陣 (12 x 5000 採樣點)
  • Output (O) : 濃縮出 128 維的「心電特徵向量」 [0.42, -1.15, ..., 0.91]

【支線 2：病歷表格專科 AI (MLP 多層感知機)】
  • Input (I)  : 34 項結構化病歷數值 (年齡、BMI、手術風險等級、高血壓/糖尿病/心衰竭等共病 ICD-10、術前檢驗值)
  • Output (O) : 濃縮出 32 維的「臨床特徵向量」 [0.12, 0.88, ..., 0.55]
```

### 2. 晚期融合 (Late Fusion) 與最後決策層
1. **向量拼接 (Concatenation)**：
   * 將波形特徵（128 個數字）與病歷特徵（32 個數字）排成一排，合併為 **160 個數字的長條向量**。
2. **全連接決策層 (Dense Layer + Sigmoid)**：
   * 給這 160 個指標各自乘上加權權重後加總，通過 Sigmoid 函數壓縮為 **$0\% \sim 100\%$ 的風險機率值**（例如：術後心肌梗塞風險為 85.3%）。

### 3. 選用理由與架構深層解析
* **為什麼波形選 ResNet？（直通旁路 Shortcut 與保底機制）**：
  * **傳統深層網絡痛點**：層數過深（30~50 層）時，訊號過度扭曲且梯度反向傳播時連續乘積衰減為 0（梯度消失），網路直接退化。
  * **ResNet 的核心公式**：$\text{輸出 } y = F(x) + x$。在相鄰層之間拉一條**直通旁路（Shortcut Connection）**。
  * **保底作用**：即使深層神經元學不出新東西（$F(x)=0$），上一層的特徵也能無損傳遞（$y=x$），保證深層網路效能絕不弱於淺層；同時梯度能順著旁路無損回傳，解決梯度消失！
* **為什麼表格用 MLP 而不用 XGBoost？（全流程連續可微）**：
  * **樹模型（XGBoost）**是離散的階梯硬切分，內部不可微，誤差無法穿透回傳。
  * **神經網絡（MLP）**全由平滑旋鈕組成，整條電路連續可微。當最後猜錯時，**反向傳播算法（連鎖律 Chain Rule）**能在 0.001 秒內精確計算出全身上下 500 萬個旋鈕各自的責任歸屬，一氣呵成同時微調 ResNet 與 MLP！

---

## 🔍 Part 5: 破解黑盒子：反事實可解釋性 (Counterfactual XAI) 與批判思考

### 1. 為什麼反事實生成專門聚焦微調 EKG？（臨床可干預性 vs 客觀事實）
* **病歷資料（年齡、性別、手術種類）是不可逆的客觀事實**：
  * 若 AI 對病歷做反事實微調，得出「如果病患年輕 30 歲、不要開大手術就安全」，在臨床上是毫無意義的廢話。
  * 結構化病歷的可解釋性直接由 **特徵重要性 (Feature Importance)** 呈現。
* **心電圖是「當前心臟電生理狀態，且具備臨床可干預性 (Actionable)」**：
  * 若 AI 指出「只要把 V4~V6 壓低的 ST 段微調拉平，風險就會降至安全範圍」，麻醉醫師便能精確掌握病患的危險核心在於**內膜下缺血**，進而採取加排心超、術中升壓、術後驗心肌酵素等具體醫療作為！

### 2. 反事實核心邏輯（找碴比對法）
1. **生成虛擬健康 ECG**：AI 保持病患原始波形基底不變，透過梯度反向運算，生成一張「在 AI 眼中為低風險」的反事實波形。
2. **殘差熱圖 (Difference Map)**：$\text{熱區} = |\text{真實波形} - \text{反事實正常波形}|$。相減差值顯著之處即為致病病灶。

### 3. 論文驗證的三大臨床病理發現
1. **QRS 波群增寬 (Prolonged QRS)**：心室傳導阻滯、心肌纖維化、左心室肥厚。
2. **低電位複波 (Low-voltage complexes)**：心肌病、心包積液。
3. **ST 段顯著壓低 (ST-segment depression)**：內膜下心肌缺血。

### 4. 🧠 晨會亮點：本研究可解釋性的限制與批判性思考 (Critical Appraisal)
> **關鍵質疑：如果病患的高風險根本來自於「病歷端（如緊急主動脈瘤破裂大手術）」，演算法強迫只微調心電圖，會不會造成「硬在 ECG 找替死鬼」的歸因偏差（Forced Attribution / Over-compensation）？**
* **限制剖析**：
  * 當病歷端（MLP）已產生巨大風險分數（+90%）時，演算法為了將總風險強行壓低至 15%，可能會在心電圖上產生**「過度代償修改」**，導致殘差熱圖把微小噪訊誤判為嚴重病灶。
* **未來改進方向**：
  * 應先透過 SHAP 評估「病歷 vs 波形」各自的責任貢獻度，再動態決定反事實生成的微調標的，避免「病歷生病、卻硬在心電圖上找藉口」。

---

## 📊 Part 6: 成果對比與麻醉臨床價值 (Results vs. RCRI)

### 1. 預測效能全面對比表 (Discrimination: AUROC)

| 預測之臨床終點 | 傳統臨床黃金標準 (RCRI) | 純 ECG 深度學習模型 | **多模態融合模型 (ECG + 臨床)** |
| :--- | :---: | :---: | :---: |
| **術後心肌梗塞 (Postop MI)** | 0.652 (0.631–0.673) | 0.812 (0.798–0.826) | **0.858 (0.845–0.872)** |
| **院內全因死亡 (In-hospital Mortality)** | 0.724 (0.709–0.739) | 0.846 (0.835–0.857) | **0.899 (0.889–0.908)** |
| **複合不良心血管事件 (MACE)** | 0.681 (0.670–0.692) | 0.795 (0.786–0.804) | **0.835 (0.827–0.843)** |

### 2. 為什麼能大幅超越 RCRI？
* **資訊維度壓制**：RCRI 僅 6 個粗略二元變數；本模型輸入 $12 \times 5000 = 60,000$ 個波形電壓點 + 34 項全身臨床參數。
* **揪出隱匿性高危病患**：RCRI 容易漏判無症狀但心電圖已有微細缺血/傳導異常的病患，深度學習能精準識別。

### 3. 麻醉與圍術期臨床實務落地指引
1. **術前評估**：針對 AI 示警之高危病患，主動加排經胸前心臟超音波 (TTE) 或心臟科照會。
2. **術中監測**：早期建立侵入性動脈導管 (A-line)，嚴格維持目標平均動脈壓 ($\text{MAP} \ge 65\text{ mmHg}$)。
3. **術後照護**：連續 48~72 小時追蹤高敏感度心肌酵素 (hs-Troponin)，早期診斷圍術期心肌損傷 (MINS)。

---

## 🎙️ 晨會逐頁演講台詞精華 (Slide-by-Slide Script)

### 【Slide 1: 寫程式 vs 機器學習】
> 「主任、VS 周韋翰醫師、CR 李孟柔醫師以及各位同仁早安，我是 UGY 謝一陽。今天由我為大家帶來 BJA 2025 這篇利用 12 導程心電圖與深度學習預測術後心血管事件的研究。
> 在切入模型前，我們先看左邊這張尋寶圖：傳統寫程式就像人類鋪好固定石板路，依照寫死的 if-else 規則走到終點；而機器學習是我們給電腦大量的歷史資料（Data）與終點答案（Goal），中間路線是個大問號，演算法自己透過成千上萬次的試錯，把判斷規則學出來。」

### 【Slide 2: ML 三大主流學習方式】
> 「機器學習主要分為三種方式：第一是**監督式學習**，像刷有詳解的考古題，給題目也給答案，模型透過誤差回傳學出分類邊界（如本文採用的心梗預測）；第二是**非監督式學習**，沒有答案，讓電腦自行根據病患特徵把群體分群；第三是**強化學習**，透過環境中的獎懲反饋學出最佳連續決策。」

### 【Slide 3: 傳統 ML 痛點 ➔ DL 定義 ➔ CNN 原理】
> 「在進入深度學習前，我們先看這個經典猜謎：『我是誰？』看到左邊黑影大家都覺得是皮卡丘，但公布答案——竟然是硬塞在輪廓裡的 CVC 置入圖！
> 開個玩笑，但這正是傳統 ML 的痛點：依賴人類手動量測特徵，容易被粗糙的表面輪廓蒙蔽。
> 深度學習的定義，就是透過多層神經網路直接從原始波形做『端到端表徵學習』。而處理心電圖的 1D-CNN，就像拿著放大鏡沿著 10 秒心電圖的時間軸滑動掃描，從淺層斜率、中層波形到深層跨導程整合，精準捕捉 ST 壓低與 QRS 增寬。」

### 【Slide 4: 本文多模態架構、ResNet 保底旁路與反向傳播】
> 「本篇論文採用的是**多模態深度學習**：
> 心電圖支線利用 **1D-ResNet** 處理 $12 \times 5000$ 連續電壓，透過加裝『直通旁路』解決了深層網路梯度消失的致命問題，濃縮出 128 維特徵；病歷支線利用 **MLP** 處理 34 項結構化病歷，濃縮出 32 維特徵。
> 最後透過**晚期融合（Late Fusion）**加權輸出。因為整條神經網路全部平滑可微，猜錯時能透過反向傳播連鎖律，在瞬間同時微調所有波形與病歷神經元！」

### 【Slide 5: 破解黑盒子 — 反事實可解釋性與批判思考】
> 「在可解釋性上，研究採用了**反事實生成框架**，問自己：『要將高危病患變安全，心電圖波形需做怎樣最小的修復？』
> 兩圖重疊相減，高亮出來的正是 **QRS 延長、低電位與 ST 段壓低**，完全吻合臨床電生理認知！
> **但這裡我們也提出一個深度的批判性思考**：如果病患的高危險純粹來自於『緊急大手術與洗腎』，強迫只微調心電圖可能會造成『心電圖過度代償』的歸因偏差。未來結合 SHAP 進行多模態動態權重歸因，將會更加嚴謹。」

### 【Slide 6: 成果對比與臨床總結】
> 「最後看成果：傳統 RCRI 預測術後 MI 的 AUROC 只有 0.652，而多模態融合模型大幅躍升至 **0.858**，院內死亡率更達 **0.899**！它能幫我們在術前揪出 RCRI 漏判的隱匿性高危病患，指導術中 A-line 升級監測與術後心肌酵素追蹤，是圍術期智慧醫療的重要里程碑。」
