import Grid from "./Grid";

export default function GridLayout() {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Grid />
      <Grid />
      <Grid />
      <Grid />
      <Grid />
      <Grid />
      <Grid />
      <Grid />
      <Grid />
    </div>
  );
}
