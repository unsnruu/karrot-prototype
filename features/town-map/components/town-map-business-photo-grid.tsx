import { AppImage } from "@/components/ui/app-image";

export function TownMapBusinessPhotoGrid({
  businessId,
  businessName,
  imageGallery,
}: {
  businessId: string;
  businessName: string;
  imageGallery: string[];
}) {
  return (
    <section className="grid grid-cols-2 gap-1 px-4 py-4">
      {Array.from({ length: 6 }).map((_, index) => {
        const image = imageGallery[index % Math.max(imageGallery.length, 1)] ?? imageGallery[0];

        if (!image) {
          return null;
        }

        return (
          <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#f3f4f6]" key={`${businessId}-photo-${index}`}>
            <AppImage alt={`${businessName} 사진 ${index + 1}`} className="object-cover" fill sizes="50vw" src={image} />
          </div>
        );
      })}
    </section>
  );
}
