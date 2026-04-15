# 홈 Native Ad 이미지 경로

## 목적
이 문서는 `home_native_ads` 데이터에 연결할 이미지 파일의 제공 경로를 정리하기 위한 문서입니다.

## 기본 루트
- 이미지 루트 경로: `/Users/unsnruu/Documents/projects/dev/2026/karrot/supabase/images/home-native-ads`
- Supabase Storage bucket: `home-native-ads`

## feature별 폴더
- `동네지도` -> `/Users/unsnruu/Documents/projects/dev/2026/karrot/supabase/images/home-native-ads/town-map`
- `동네 생활` -> `/Users/unsnruu/Documents/projects/dev/2026/karrot/supabase/images/home-native-ads/town-life`
- `모임` -> `/Users/unsnruu/Documents/projects/dev/2026/karrot/supabase/images/home-native-ads/meetup`
- `카페` -> `/Users/unsnruu/Documents/projects/dev/2026/karrot/supabase/images/home-native-ads/cafe`

## 권장 파일명 규칙
- `동네지도`
  - `town-map-ad-01.webp`
  - `town-map-ad-02.webp`
  - `town-map-ad-03.webp`
- `동네 생활`
  - `town-life-ad-01.webp`
  - `town-life-ad-02.webp`
- `모임`
  - `meetup-ad-01.webp`
  - `meetup-ad-02.webp`
  - `meetup-ad-03.webp`
- `카페`
  - `cafe-ad-01.webp`
  - `cafe-ad-02.webp`

## image_url에 들어갈 값 예시
- `동네지도` 광고 1번
  - `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-map/town-map-ad-01.webp`
- `동네 생활` 광고 1번
  - `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-life/town-life-ad-01.webp`
- `모임` 광고 1번
  - `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/meetup/meetup-ad-01.webp`
- `카페` 광고 1번
  - `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/cafe/cafe-ad-01.webp`

## 현재 기준 추천 매핑
- `sort_order 1`
  - feature: `동네지도`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-map/town-map-ad-01.webp`
- `sort_order 2`
  - feature: `동네 생활`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-life/town-life-ad-01.webp`
- `sort_order 3`
  - feature: `모임`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/meetup/meetup-ad-01.webp`
- `sort_order 4`
  - feature: `카페`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/cafe/cafe-ad-01.webp`
- `sort_order 5`
  - feature: `동네지도`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-map/town-map-ad-02.webp`
- `sort_order 6`
  - feature: `동네 생활`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-life/town-life-ad-02.webp`
- `sort_order 7`
  - feature: `모임`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/meetup/meetup-ad-02.webp`
- `sort_order 8`
  - feature: `카페`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/cafe/cafe-ad-02.webp`
- `sort_order 9`
  - feature: `동네지도`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/town-map/town-map-ad-03.webp`
- `sort_order 10`
  - feature: `모임`
  - image_url: `https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/meetup/meetup-ad-03.webp`

## 메모
- 현재 폴더는 모두 생성되어 있습니다.
- 이미지 파일은 `webp` 로 변환 후 Supabase Storage 업로드까지 완료했습니다.
- 최종 연결 데이터는 `supabase/home_native_ads_seed.csv` 를 참고하면 됩니다.
