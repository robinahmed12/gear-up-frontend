import Image from "next/image";
import { notFound } from "next/navigation";
import { getGearById } from "../../_actions/getGearById";
import { getGearReviews } from "../../_actions/getGearReviews";
import ReviewList from "../../_components/reviews/ReviewList";
import RentNowForm from "../../_components/gear/RentNowForm";


interface GearDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}



export default async function PublicgroupGearByIdPage({
  params,
}: GearDetailsPageProps) {


  const { id } = await params;


  const [
    gearResponse,
    reviewResponse,
  ] = await Promise.all([
    getGearById(id),
    getGearReviews(id),
  ]);



  if (!gearResponse.success || !gearResponse.data) {
    notFound();
  }


  const gear = gearResponse.data;

  const reviews =
    reviewResponse?.data ?? [];



  return (

    <main className="container mx-auto space-y-10 px-4 py-8">


      {/* Gallery + Info */}

      <section className="grid gap-8 lg:grid-cols-2">


        {/* Image Gallery */}

        <div className="space-y-4">


          <div className="relative h-[400px] overflow-hidden rounded-xl">

            <Image
              src={
                gear.image ??
                "/placeholder.png"
              }
              alt={gear.name}
              fill
              className="object-cover"
            />

          </div>



          {
            gear.images?.length > 0 && (

              <div className="grid grid-cols-4 gap-3">

                {
                  gear.images.map(
                    (
                      image:string,
                      index:number
                    ) => (

                    <div
                      key={index}
                      className="relative h-24 overflow-hidden rounded-lg"
                    >

                      <Image
                        src={image}
                        alt={`${gear.name}-${index}`}
                        fill
                        className="object-cover"
                      />

                    </div>

                  ))
                }

              </div>

            )
          }


        </div>




        {/* Gear Details */}

        <div className="space-y-6">


          <div>

            <h1 className="text-3xl font-bold">
              {gear.name}
            </h1>


            <p className="mt-2 text-muted-foreground">
              {gear.category?.name}
            </p>

          </div>




          <div className="rounded-lg border p-5">

            <p className="text-2xl font-bold">
              ৳{gear.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </p>


            <p className="mt-2">
              {
                gear.availability
                  ? "Available"
                  : "Currently unavailable"
              }
            </p>


          </div>




          {/* Specification */}

          <div>

            <h2 className="mb-3 text-xl font-semibold">
              Specifications
            </h2>


            <p className="text-muted-foreground">
              {gear.description}
            </p>

          </div>




          {/* Provider */}

          {
            gear.provider && (

              <div className="rounded-lg border p-5">

                <h2 className="font-semibold">
                  Provider Information
                </h2>


                <p>
                  {gear.provider.name}
                </p>


                <p className="text-sm text-muted-foreground">
                  {gear.provider.email}
                </p>


              </div>

            )
          }





          {/* Rent Form */}

          <RentNowForm
            gearId={gear.id}
            pricePerDay={gear.pricePerDay}
            available={gear.availability}
          />


        </div>


      </section>





      {/* Reviews */}

      <section>

        <h2 className="mb-5 text-2xl font-bold">
          Customer Reviews
        </h2>


        <ReviewList
          reviews={reviews}
        />


      </section>



    </main>

  );
}