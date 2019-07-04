import getPositionForHighlighting from './GetPositionForHighlighting';

const GetMetricsForDisplayingGradientLineHighlight = (min, max) => {
  const gradientLineWidthPerFraction = 312 / 21; //gradientLine width at all
  const minPosition = getPositionForHighlighting(min); // find the min position in gradient
  const maxPosition = getPositionForHighlighting(max); // find the max position in gradient
  const intervalFromMinToMax = maxPosition - minPosition + 1; // find the interval including the last last step
  const calculatedLeftMargin =
    minPosition !== 1 ? minPosition * gradientLineWidthPerFraction : 0;
  const calculatedWidth = intervalFromMinToMax * gradientLineWidthPerFraction;

  return [calculatedLeftMargin, calculatedWidth];
};

export default GetMetricsForDisplayingGradientLineHighlight;
