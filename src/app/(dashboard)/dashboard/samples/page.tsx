import { getSamples } from "./actions";
import { SamplesClient } from "./_samples-client";

export default async function SamplesPage() {
  const samples = await getSamples();
  return <SamplesClient initialSamples={samples} />;
}
