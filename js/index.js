
/**
 * ランダム整数値作成
 * @param {*} min 
 * @param {*} max 
 */
const createRandomInterger = (min ,max) => {
  const minStandard = Math.ceil(min);
  const maxStandard = Math.floor(max);

  return Math.floor(Math.random() * (maxStandard - minStandard + 1) + min);
}

/**
 * 引数の数値分の配列を作成する。
 * @param {*} count 
 */
const repeat = (count) => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
}

/**
 * カラーパレット取得。prevColorと同一ではない色を取得
 * @param {*} prevColor 
 */
const getColorPalette = (prevColor) => {
  const colors = [
    'hsl(171, 100%, 41%)',
    'hsl(217, 71%, 53%)',
    'hsl(204, 86%, 53%)',
    'hsl(141, 53%, 53%)',
    'hsl(48, 100%, 67%)',
    'hsl(348, 100%, 61%)',
    'hsl(0, 0%, 21%)',
  ];

  const getColor = () => {
    const index = createRandomInterger(0, colors.length - 1);
    const color = colors[index];
    if (prevColor !== color) {
      return color;
    }
    return getColor(); // 再帰処理
  }
  return getColor();
}


/**
 * バブルソートクラス
 */
class BubbleSort {
  constructor() {
    this.currentSort = [];
    this.isError = false;
    this.sortArea = document.getElementsByClassName('bubble-sort-area')[0];
    this.executeBubbleSort = document.getElementById('executeBubbleSort');
    this.message= document.getElementById('message');
    this.resetButton = document.getElementById('resetBubbleSort');
    this.maxBarCountElement = document.getElementById("maxBarCount");
    this.maxMeasureCountElement = document.getElementById('maxMeasureCount');

    /**バインド */
    this.maxBarCountElement.addEventListener('change', (ev) => {
      const num = parseInt(ev.target.value, 10);
      const isValid = Number.isInteger(num);
      isValid ? 
        document.getElementById('maxBarCountError').classList.add('is-hide') :
        document.getElementById('maxBarCountError').classList.remove('is-hide');

      if (!isValid) {
        this.isError = true;
        return;
      }

      this.setup();
      this.init();
    });

    /**バインド */
    this.maxMeasureCountElement.addEventListener('change', (ev) => {
      const num = parseInt(ev.target.value, 10);
      const isValid = Number.isInteger(num);
      isValid ? 
        document.getElementById('maxMeasureCountError').classList.add('is-hide') :
        document.getElementById('maxMeasureCountError').classList.remove('is-hide');

      if (!isValid) {
        this.isError = true;
        return;
      }

      this.setup();
      this.init();
    });


    this.setup();
    this.init();
  }

  /**
   * セットアップ
   */
  setup() {
    this.maxBarCount = parseInt(this.maxBarCountElement.value, 10);
    this.maxMeasureCount = parseInt(this.maxMeasureCountElement.value, 10);
    this.originals = repeat(this.maxBarCount).reduce((prev, current, i) => {
      const colorArgs = i === 0 ? '' : prev[i - 1].color;
      const number = createRandomInterger(1, this.maxMeasureCount);

      prev.push({
        number: number,
        color: getColorPalette(colorArgs),
        height: number * 48,
      });

      return prev;
    }, []);
  }

  /**初期化 */
  init() {
    this.changedCount = 0;
    this.isFinish = false;
    this.currentSort = [...this.originals];
    this.render();


    this.executeBubbleSort.addEventListener('click', () => {
      const timerId = setInterval(() => {
        this.bubbleSort();

        if (this.isFinish) {
          clearInterval(timerId);
          setTimeout(() => {
            this.message.textContent = `Finish! ${this.changedCount} time changed. `;
          }, 1000);
        }
      }, 500);
    });

    this.resetButton.addEventListener('click', () => {
      this.remove();
      this.init();
    })
  }

  /**
   * 描画処理
   */
  render() {
    this.remove();

    this.currentSort.forEach(x => {
      const element = document.createElement('div');
      element.classList.add('column','is-1','item');
      element.style.height = `${x.height}px`;
      element.style.backgroundColor = x.color;
      element.innerHTML = `<div class="is-size-4 grid-text">${x.number}</div>`;

      this.sortArea.appendChild(element);
    });
    this.message.textContent = `${this.changedCount} time changed. `;
  }

  /**
   * 描画削除処理
   */
  remove() {
    const items = document.querySelectorAll('.item');
    items.forEach(item => this.sortArea.removeChild(item));
  }

  /**
   * バブルソート処理
   */
  bubbleSort() {
    let isChanged = false;
    for (let i = 0; i < this.currentSort.length; i++) {
      if (i === this.currentSort.length - 1) {
        // 一度も変更してなければ処理終了
        if (!isChanged) {
          this.isFinish = true;
          return false;
        }
        continue;
      }

      let first = this.currentSort[i];
      let second = this.currentSort[i + 1];

      if (first.number < second.number) {
        continue;
      }
      
      if (first.number > second.number) {
        isChanged = true;

        // 大小関係を整理する為に変数にて状態を整理
        const {number: nextNumber, color: nextColor, height: nextHeight} = first;
        const {number: prevNumber, color: prevColor, height: prevHeight} = second;

        this.currentSort[i] = {
          number: prevNumber,
          color: prevColor,
          height: prevHeight,
        };

        this.currentSort[i + 1] = {
          number: nextNumber,
          color: nextColor,
          height: nextHeight,
        };
        this.changedCount = this.changedCount + 1;
      }
      this.render();
    }
  }
}

const bubbleSort = new BubbleSort();
