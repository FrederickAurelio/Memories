import ArrangeToolBar from "./ArrangeToolBar";
import FillColorToolBar from "./FillColorToolBar";
import OpacityToolBar from "./OpacityToolBar";
import StrokeColorToolBar from "./StrokeColorToolBar";
import StrokeWidthToolBar from "./StrokeWidthToolBar";
import TextToolBar from "./TextToolBar";

function EditToolBar() {
  return (
    <div className="absolute top-1 z-10 w-fit">
      <div
        className={`flex items-center gap-2 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.4)]`}
      >
        <TextToolBar />
        <FillColorToolBar />
        <StrokeColorToolBar />
        <StrokeWidthToolBar />
        <OpacityToolBar />
        <ArrangeToolBar />
      </div>
    </div>
  );
}

export default EditToolBar;
