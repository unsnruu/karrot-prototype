"use client";

import * as amplitude from "@amplitude/unified";
import type { HomeExperimentVariant } from "@/lib/home-experiment";

export function setHomeExperimentUserProperties(variant: HomeExperimentVariant) {
  const identify = new amplitude.Identify();
  identify.set("home_experiment_name", "home_to_town_map_entry");
  identify.set("home_experiment_variant", variant);
  amplitude.identify(identify);
}
