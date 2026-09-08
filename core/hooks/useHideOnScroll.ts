import { SharedValue, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

type Options = {
  tolerance?: number;
  bottomTolerance?: number;
  scrollUpTolerance?: number;
};

export function useHideOnScroll(options?: Options): {
  showMenu: SharedValue<number>;
  handleScroll: ReturnType<typeof useAnimatedScrollHandler>;
  onLayout: (event: any) => void;
  onContentSizeChange: (_: number, height: number) => void;
} {
  const { tolerance = 600, bottomTolerance = 150, scrollUpTolerance = 300 } = options || {};

  const showMenu = useSharedValue(1);

  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  const lastScrollDownStopValue = useSharedValue(0);
  const lastScrollUpStopValue = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const scrollViewLayoutHeight = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      const isScrollingDown = currentY > prevScrollY.value + 1;
      const isScrollingUp = currentY < prevScrollY.value - 1;

      prevScrollY.value = scrollY.value;
      scrollY.value = currentY;

      const isNearBottom =
        scrollY.value >= scrollViewHeight.value - scrollViewLayoutHeight.value - bottomTolerance;

      if (!isNearBottom) {
        if (
          isScrollingDown &&
          scrollY.value > tolerance &&
          scrollY.value >= lastScrollUpStopValue.value + tolerance
        ) {
          lastScrollDownStopValue.value = scrollY.value;
          showMenu.value = 0;
          return;
        }

        if (
          isScrollingUp &&
          lastScrollDownStopValue.value > 0 &&
          scrollY.value <= lastScrollDownStopValue.value - scrollUpTolerance
        ) {
          lastScrollUpStopValue.value = scrollY.value;
          showMenu.value = 1;
          return;
        }
      } else {
        lastScrollDownStopValue.value = scrollY.value;
        lastScrollUpStopValue.value = scrollY.value;

        showMenu.value = 1;
      }
    },
  });

  const onLayout = (event: any) => {
    scrollViewLayoutHeight.value = event.nativeEvent.layout.height;
  };

  const onContentSizeChange = (_: number, height: number) => {
    scrollViewHeight.value = height;
  };

  return {
    showMenu,
    handleScroll,
    onLayout,
    onContentSizeChange,
  };
}
