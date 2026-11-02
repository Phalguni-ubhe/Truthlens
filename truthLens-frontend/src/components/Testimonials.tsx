import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Journalist",
      company: "Digital News Network",
      content: "TruthLens has revolutionized how we verify sources. The AI-powered fact-checking saves us hours of research while maintaining the highest accuracy standards.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Dr. Michael Chen",
      role: "Media Research Professor",
      company: "Stanford University",
      content: "The credibility scoring system is incredibly sophisticated. It's become an essential tool for our media literacy courses and research projects.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Alex Rivera",
      role: "Content Manager",
      company: "Global Media Corp",
      content: "The trend visualization features help us identify misinformation patterns before they spread. TruthLens is like having a dedicated fact-checking team.",
      rating: 5,
      avatar: "AR"
    },
    {
      name: "Emma Thompson",
      role: "Independent Journalist",
      company: "Freelancer",
      content: "As a solo journalist, TruthLens gives me the confidence that my sources are reliable. The real-time analysis is a game-changer for breaking news.",
      rating: 5,
      avatar: "ET"
    },
    {
      name: "David Park",
      role: "News Editor",
      company: "Metro Daily",
      content: "The platform's accuracy rate is impressive. We've integrated TruthLens into our editorial workflow and seen a significant improvement in content quality.",
      rating: 5,
      avatar: "DP"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Professionals</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of journalists, researchers, and media professionals who rely on TruthLens 
            for accurate information verification.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      {/* Stars */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-gray-300 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-semibold">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {testimonial.role} • {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
            <CarouselNext className="right-0 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}