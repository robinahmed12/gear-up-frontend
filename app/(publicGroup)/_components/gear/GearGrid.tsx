// Responsive grid of <GearCard>, used on home + browse pages
import Image from "next/image";
import Link from "next/link";


interface Gear {
  id: string;
  name: string;
  image?: string;
  pricePerDay: number;
  category?: {
    name: string;
  };
  availability?: boolean;
}



interface GearGridProps {
  gears: Gear[];
}



export default function GearGrid({
  gears,
}: GearGridProps) {


  if (!gears.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        No gear found.
      </div>
    );
  }



  return (

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">


      {
        gears.map((gear)=>(
          <div
            key={gear.id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >


            <div className="relative h-56 w-full">

              <Image
              
                src={
                  gear.image ??
                  "/placeholder.png"
                }
                alt={"photo"}
                fill
                className="object-cover"
              />

            </div>



            <div className="space-y-3 p-5">


              <h3 className="text-lg font-semibold">
                {gear.name}
              </h3>



              <p className="text-sm text-muted-foreground">
                {gear.category?.name}
              </p>



              <p className="font-medium">
                ৳{gear.pricePerDay}
                <span className="text-sm text-muted-foreground">
                  /day
                </span>
              </p>



              <span
                className={`inline-block rounded-full px-3 py-1 text-xs ${
                  gear.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {
                  gear.availability
                    ? "Available"
                    : "Unavailable"
                }
              </span>



              <Link
                href={`/gear/${gear.id}`}
                className="block rounded-md bg-black px-4 py-2 text-center text-white"
              >
                View Details
              </Link>


            </div>


          </div>
        ))
      }


    </div>

  );
}