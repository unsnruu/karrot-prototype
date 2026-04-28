# Archived Meetup Location Map Redesign

Archived when the active Amplitude experiment moved to `chat_appointment_place_recommendation`.

## Experiment Metadata

```ts
experiment_id: "meetup_location_map_redesign"
iteration: "1"
variant: "control" | "map_redesign" | "map_redesign_text_changed"
```

## Removed Runtime Branch

The item detail screen used to choose the map CTA label from the assigned visitor variant:

```ts
type MeetupLocationMapVariant = "control" | "map_redesign" | "map_redesign_text_changed";

const TOWN_MAP_CTA_LABEL_BY_VARIANT: Partial<Record<MeetupLocationMapVariant, string>> = {
  map_redesign: "동네지도 바로가기",
  map_redesign_text_changed: "약속 장소 주변도 둘러보기",
};

const townMapCtaLabel = TOWN_MAP_CTA_LABEL_BY_VARIANT[variant];
```

The `ItemDetailKakaoMap` branch rendered the bottom CTA only when a non-control label existed:

```tsx
<ItemDetailKakaoMap
  lat={item.meetupLat}
  lng={item.meetupLng}
  meetupAddress={item.meetupAddress}
  meetupHint={item.meetupHint}
  showTownMapCta={Boolean(townMapCtaLabel)}
  title={item.title}
  townMapCtaLabel={townMapCtaLabel}
/>
```

The live item detail flow now always uses the baseline map presentation.
