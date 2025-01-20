let selectedCells = [];
let isTestStarted = false;  // 标识是否进入正式测试

// 词语数组：正式测试的词语和正确答案
let testWords = [
    ['作', '心', '部', '开', '情', '最', '或', '公', '必', '农'],
    ['强', '花', '连', '乐', '效', '城', '拉', '势', '围', '议'],
    ['突', '富', '模', '错', '男', '款', '茶', '网', '祝', '联'],
    ['阶', '党', '县', '妇', '圆', '毒', '献', '哲', '鬼', '妻'],
    ['汗', '煤', '潜', '震', '贡', '艰', '融', '肩', '贴', '兼'],
    ['裁', '闲', '桃', '牢', '寺', '仓', '扇', '嘉', '饼', '傲'],
    ['脉', '岩', '荡', '腹', '芽', '饲', '膀', '斥', '胎', '鹿'],
    ['甸', '巢', '譬', '契', '凳', '溃', '倘', '衍', '髓', '鸽'],
    ['僵', '膊', '爵', '挪', '钥', '羡', '兑', '拧', '删', '惦'],
    ['秦', '藻', '蚀', '巫', '绷', '菩', '颓', '汛', '嫦', '诽']
];
let testCorrectAnswers = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

document.addEventListener("DOMContentLoaded", function() {
    userFileName = prompt("请输入保存CSV文件的名称（不需要扩展名）", "results");
if (!userFileName) {  // 如果用户没有输入文件名，使用默认值
    userFileName = "results";
}

    // 页面加载完成后显示图片（指导语），并准备好表格
    displayImage("image.png");  // 显示指导语的图片
    
    // 监听按键事件，按下回车进入正式测试
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            if (!isTestStarted) {
                // 隐藏指导语并进入正式测试模式
                hideImage();
                startTestMode();  // 进入正式测试
            }
        } else if (event.key === " " && isTestStarted) {
            // 按空格结束实验并下载结果文件
            calculateResults();  // 计算结果
        }
    });
});

// 显示图片
function displayImage(imageSrc) {
    let imageElement = document.createElement("img");
    imageElement.src = imageSrc;  // 这里传入图片路径
    imageElement.alt = "实验指导语";
    imageElement.id = "experimentImage"; // 给图片一个ID以便以后隐藏
    document.body.appendChild(imageElement);

    // 为图片添加居中样式
    document.body.style.textAlign = "center"; // 水平居中
    imageElement.style.marginTop = "20px";     // 添加一些顶部空白，使图片不紧贴顶部
    imageElement.style.maxWidth = "100%";      // 确保图片不会超出屏幕宽度
}

// 隐藏图片
function hideImage() {
    let imageElement = document.getElementById("experimentImage");
    if (imageElement) {
        imageElement.style.display = "none"; // 隐藏图片
    }
}

// 正式测试模式：开始创建表格
function startTestMode() {
    isTestStarted = true;  // 进入正式测试
    selectedCells = [];  // 清空之前的选择
    createTable(testWords, testCorrectAnswers);  // 创建正式测试的表格
}

// 创建表格
function createTable(wordsArray, answersArray) {
    let table = document.getElementById("gameTable");
    table.innerHTML = ""; // 清空之前的表格

    for (let i = 0; i < answersArray.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < answersArray[i].length; j++) {
            let cell = row.insertCell();
            cell.textContent = wordsArray[i][j];  // 用词语数组填充单元格
            cell.onclick = function() {
                toggleCellSelection(i, j);
            };
        }
    }
}

// 选择/取消选择单元格
function toggleCellSelection(row, col) {
    let cell = document.getElementById("gameTable").rows[row].cells[col];
    
    if (selectedCells.includes(`${row},${col}`)) {
        // 取消选择
        selectedCells = selectedCells.filter(cellId => cellId !== `${row},${col}`);
        cell.classList.remove("selected");
    } else {
        // 选择
        selectedCells.push(`${row},${col}`);
        cell.classList.add("selected");
    }

    console.log(selectedCells);  // 用于调试，查看选中的单元格
}

// 计算结果
function calculateResults() {
    let correctCount = 0;
    let incorrectCount = 0;
    let detailedResults = [];

    let currentAnswers = testCorrectAnswers;  // 只考虑正式测试的答案

    for (let i = 0; i < currentAnswers.length; i++) {
        for (let j = 0; j < currentAnswers[i].length; j++) {
            let isSelected = selectedCells.includes(`${i},${j}`);
            let isCorrect = currentAnswers[i][j] === 1;

            // 判断正确与否
            let result = {
                word: testWords[i][j],
                isSelected: isSelected,
                isCorrect: isCorrect,
                isAnswerCorrect: (isSelected === isCorrect)
            };

            if (result.isAnswerCorrect) {
                correctCount++;
            } else {
                incorrectCount++;
            }

            detailedResults.push(result);
        }
    }

    alert(`正确数量: ${correctCount}, 错误数量: ${incorrectCount}`);
    exportCSV(detailedResults, correctCount, incorrectCount);
}

// 导出CSV
function exportCSV(detailedResults, correctCount, incorrectCount) {
    // CSV 数据的表头
    const header = ["词语", "是否选中", "正确答案", "是否正确"];

    let data = [];
    // 添加详细结果
    detailedResults.forEach(result => {
        data.push([result.word, result.isSelected ? "是" : "否", result.isCorrect ? "是" : "否", result.isAnswerCorrect ? "是" : "否"]);
    });

    // 添加总结行
    data.push(["正确数量", correctCount, "错误数量", incorrectCount]);

    // 构建 CSV 内容
    let csvContent = "data:text/csv;charset=utf-8,";
    // 添加表头
    csvContent += header.join(",") + "\r\n";
    
    // 添加每一行数据
    data.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    // 创建并触发下载
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userFileName}.csv`);  // 使用用户输入的文件名保存
    link.click();
}
