import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../components/Forms/InputField';
import TextareaField from '../components/Forms/TextAreaField';
import Loader from '../components/Loader';

const CampaignDetailsPage = () => {
	const { campaignId } = useParams();
	const [campaign, setCampaign] = useState({});
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		amount: '',
		message: '',
	});

	useEffect(() => {
		const fetchCampaign = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:8000/api/v1/campaigns/${campaignId}`
				);
				const data = await response.json();
				console.log(data);
				setCampaign(data.data);
			} catch (err) {
				console.log(err);
				toast.error('Failed to fetch campaign');
			} finally {
				setLoading(false);
			}
		};
		fetchCampaign();
	}, [campaignId]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};
	const {
		imageURL,
		title,
		type,
		description,
		minDonation,
		deadline,
		currentAmount,
		targetAmount,
		author,
	} = campaign;
	const handleDonate = () => {
		alert('Thanks for donating!');
	};
	const donationProgress = Math.min((currentAmount / targetAmount) * 100, 100);

	if (loading) return <Loader />;
	return (
		<section className="max-w-4xl mx-auto px-4">
			<div className="p-6 bg-white shadow-md rounded-lg">
				{/* Campaign Image */}
				<div className="w-full h-72 overflow-hidden rounded-lg mb-6">
					<img
						src={imageURL}
						alt={title}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
				</div>
				{/* Campaign Info */}
				<h1 className="text-3xl font-bold mb-2">{title}</h1>
				<p className="badge text-sm text-gray-500 uppercase tracking-wider mb-4">
					{type}
				</p>
				<div className="mb-6">
					<div className="flex justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">
							${currentAmount || 0} raised
						</span>
						<span className="text-sm font-medium text-gray-600">
							target: ${targetAmount || 0}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-4">
						<div
							className="bg-green-500 h-4 rounded-full"
							style={{ width: `${donationProgress}%` }}
						></div>
					</div>
					<p className="text-sm text-gray-500 mt-2">
						Deadline: {new Date(deadline).toLocaleDateString()}
					</p>
				</div>
				<p className="text-gray-700 mb-6">{description}</p>
				{/* Author Info */}
				<div className="flex items-center mb-6">
					<img
						src={author?.photoURL || 'https://i.pravatar.cc/50'}
						alt={author?.name}
						className="w-10 h-10 rounded-full mr-3"
					/>
					<div>
						<p className="text-sm font-medium">{author?.name}</p>
						<p className="text-xs text-gray-500">{author?.email}</p>
					</div>
				</div>
				{/* Donation Section */}
				<div className="p-6 bg-gray-100 rounded-lg">
					<div className="max-w-md mx-auto">
						<InputField
							label={`Donation Amount(Minimum $${minDonation})`}
							type="number"
							name="amount"
							value={100}
							onChange={handleInputChange}
							placeholder="Enter your donation amount"
							required
						/>
						<TextareaField
							label="Message(optional)"
							name="message"
							value={formData.message}
							onChange={handleInputChange}
							rows={4}
							placeholder="Say something..."
						/>

						<button
							onClick={handleDonate}
							className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
						>
							Donate
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CampaignDetailsPage;
