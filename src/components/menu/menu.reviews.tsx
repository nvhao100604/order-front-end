import { FaStar } from "react-icons/fa";

const RatingsAndReviews = () => {
    const ratings = 4.5;
    const reviews = [
        {
            id: 1,
            author: "John Doe",
            rating: 5,
            comment: "Absolutely love this product! Highly recommend.",
        },
        {
            id: 2,
            author: "Jane Smith",
            rating: 4,
            comment: "Good quality, delivered on time.",
        },
    ];

    return (
        <div className="py-8">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <div className="flex justify-center items-center mt-2">
                    {[...Array(5)].map((star, index) => (
                        <FaStar key={index} className={`w-6 h-6 ${index < Math.round(ratings) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-lg">{ratings} out of 5</span>
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 py-4">
                        <div className="flex items-center">
                            <div className="text-lg font-semibold">{review.author}</div>
                            <div className="flex ml-2">
                                {[...Array(review.rating)].map((star, index) => (
                                    <FaStar key={index} className="w-4 h-4 text-yellow-400" />
                                ))}
                            </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingsAndReviews;