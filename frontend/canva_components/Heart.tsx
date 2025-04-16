import { Shape } from "react-konva";

function Heart({ ...rest }) {
  return (
    <Shape
      {...rest}
      sceneFunc={(ctx, shape) => {
        ctx.beginPath();
        const width = shape.width();
        const height = shape.height();
        const x = width / 2;
        const y = -6;

        const topCurveHeight = height * 0.36;

        // Left side of heart
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(
          x,
          y,
          x - width / 2,
          y,
          x - width / 2,
          y + topCurveHeight,
        );

        // Bottom tip
        ctx.bezierCurveTo(
          x - width / 2,
          y + height * 0.75,
          x,
          y + height * 0.9,
          x,
          y + height,
        );

        // Right side of heart
        ctx.bezierCurveTo(
          x,
          y + height * 0.9,
          x + width / 2,
          y + height * 0.75,
          x + width / 2,
          y + topCurveHeight,
        );

        ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);

        ctx.closePath();
        ctx.fillStrokeShape(shape);
      }}
    />
  );
}

export default Heart;
