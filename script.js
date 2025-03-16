document.addEventListener("DOMContentLoaded", function () {
  // 정답 데이터
  const answers = {
    "across-1": "데이터베이스",
    "across-5": "교착상태",
    "across-7": "기본키",
    "across-8": "스키마",
    "across-11": "속성",
    "across-12": "뷰",
    "across-13": "트리거",
    "across-14": "외래키",
    "across-15": "정규화",
    "down-1": "데",
    "down-2": "이",
    "down-3": "테이블",
    "down-4": "인덱스",
    "down-6": "엔티티",
    "down-9": "무결성",
    "down-10": "뷰",
  };

  // 단어 위치 맵핑
  const wordCells = {};

  // 모든 단어에 대한 셀 위치 매핑 구성
  Object.keys(answers).forEach((wordId) => {
    wordCells[wordId] = [];
  });

  // 모든 입력 필드에 이벤트 리스너 추가
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach((input) => {
    // 입력 이벤트 처리
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();

      if (this.value) {
        moveToNextCell(this);
      }
    });

    // 포커스 이벤트
    input.addEventListener("focus", function () {
      highlightWord(this);
    });

    // 키보드 이벤트 처리
    input.addEventListener("keydown", function (e) {
      handleKeyDown(e, this);
    });

    // 더블클릭 이벤트 처리
    input.addEventListener("dblclick", function () {
      // 해당 셀의 모든 글자 선택
      this.select();
    });

    // 단어 맵핑 구성
    const wordIds = (input.getAttribute("data-word") || "").split(" ");
    wordIds.forEach((wordId) => {
      if (wordId && wordCells[wordId]) {
        wordCells[wordId].push(input);
      }
    });
  });

  // 다음 셀로 이동
  function moveToNextCell(currentInput) {
    const currentCell = currentInput.parentElement;
    const x = parseInt(currentInput.getAttribute("data-x"));
    const y = parseInt(currentInput.getAttribute("data-y"));

    // 오른쪽 셀 찾기
    const nextInput = document.querySelector(
      `input[data-x="${x + 1}"][data-y="${y}"]`
    );
    if (nextInput) {
      nextInput.focus();
      return;
    }

    // 아래쪽 셀 찾기
    const belowInput = document.querySelector(
      `input[data-x="${x}"][data-y="${y + 1}"]`
    );
    if (belowInput) {
      belowInput.focus();
    }
  }

  // 키보드 이벤트 핸들러
  function handleKeyDown(e, input) {
    const currentCell = input.parentElement;
    const x = parseInt(input.getAttribute("data-x"));
    const y = parseInt(input.getAttribute("data-y"));

    switch (e.key) {
      case "Backspace":
        if (!input.value) {
          // 이전 셀로 이동
          const prevInput =
            document.querySelector(`input[data-x="${x - 1}"][data-y="${y}"]`) ||
            document.querySelector(`input[data-x="${x}"][data-y="${y - 1}"]`);
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        const upInput = document.querySelector(
          `input[data-x="${x}"][data-y="${y - 1}"]`
        );
        if (upInput) upInput.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        const downInput = document.querySelector(
          `input[data-x="${x}"][data-y="${y + 1}"]`
        );
        if (downInput) downInput.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        const leftInput = document.querySelector(
          `input[data-x="${x - 1}"][data-y="${y}"]`
        );
        if (leftInput) leftInput.focus();
        break;
      case "ArrowRight":
        e.preventDefault();
        const rightInput = document.querySelector(
          `input[data-x="${x + 1}"][data-y="${y}"]`
        );
        if (rightInput) rightInput.focus();
        break;
    }
  }

  // 현재 입력란의 단어 강조 표시
  function highlightWord(input) {
    // 모든 강조 표시 제거
    document.querySelectorAll(".highlighted").forEach((cell) => {
      cell.classList.remove("highlighted");
    });

    // 입력란의 단어 ID 확인
    const wordIds = (input.getAttribute("data-word") || "").split(" ");

    // 첫 번째 단어 ID에 해당하는 모든 셀 강조 표시
    if (wordIds[0] && wordCells[wordIds[0]]) {
      wordCells[wordIds[0]].forEach((cell) => {
        cell.parentElement.classList.add("highlighted");
      });
    }
  }

  // 정답 확인 함수
  function checkAnswers() {
    let correct = true;
    let filledCells = 0;
    let totalCells = 0;

    // 모든 단어 확인
    for (const [wordId, answer] of Object.entries(answers)) {
      const cells = wordCells[wordId];
      totalCells += cells.length;

      // 사용자 입력 읽기
      let userAnswer = "";
      cells.forEach((cell) => {
        userAnswer += cell.value || " ";
        if (cell.value) filledCells++;
      });

      // 정답 비교 (공백 무시)
      if (userAnswer.trim() !== answer.trim()) {
        correct = false;
      }
    }

    // 결과 표시
    const resultEl = document.getElementById("check-result");
    resultEl.style.display = "block";

    if (filledCells === 0) {
      resultEl.textContent = "아직 아무 단어도 입력하지 않았습니다.";
      resultEl.className = "";
    } else if (filledCells < totalCells) {
      resultEl.textContent = `아직 완성되지 않았습니다. (${filledCells}/${totalCells} 셀 입력됨)`;
      resultEl.className = "incorrect";
    } else if (correct) {
      resultEl.textContent = "축하합니다! 모든 단어를 정확하게 입력했습니다.";
      resultEl.className = "correct";
    } else {
      resultEl.textContent = "오답이 있습니다. 다시 확인해보세요.";
      resultEl.className = "incorrect";
    }
  }

  // 정답 보기 함수
  function revealAnswers() {
    if (!confirm("정말 정답을 확인하시겠습니까?")) {
      return;
    }

    // 모든 단어의 정답 입력
    for (const [wordId, answer] of Object.entries(answers)) {
      const cells = wordCells[wordId];

      // 정답 입력
      for (let i = 0; i < cells.length; i++) {
        if (i < answer.length) {
          cells[i].value = answer[i];
        }
      }
    }

    // 결과 표시
    const resultEl = document.getElementById("check-result");
    resultEl.style.display = "block";
    resultEl.textContent = "정답이 모두 표시되었습니다.";
    resultEl.className = "correct";
  }

  // 초기화 함수
  function resetPuzzle() {
    if (!confirm("십자말풀이를 초기화하시겠습니까?")) {
      return;
    }

    // 모든 입력값 지우기
    document.querySelectorAll(".cell input").forEach((input) => {
      input.value = "";
    });

    // 강조 표시 제거
    document.querySelectorAll(".highlighted").forEach((cell) => {
      cell.classList.remove("highlighted");
    });

    // 결과 메시지 삭제
    const resultEl = document.getElementById("check-result");
    resultEl.style.display = "none";
    resultEl.textContent = "";
    resultEl.className = "";

    // 첫 번째 입력란에 포커스
    const firstInput = document.querySelector(".cell input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  // 정답 확인 버튼
  document
    .getElementById("check-answers")
    .addEventListener("click", function () {
      checkAnswers();
    });

  // 정답 보기 버튼
  document
    .getElementById("reveal-answers")
    .addEventListener("click", function () {
      revealAnswers();
    });

  // 초기화 버튼
  document
    .getElementById("reset-puzzle")
    .addEventListener("click", function () {
      resetPuzzle();
    });
});
