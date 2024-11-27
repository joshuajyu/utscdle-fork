import { MapPin } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { MapProvider } from "../../hooks/mapProvider";
import { MapComponentSI } from "../../components/mapSI";
import { SubmitImageButton } from "../../components/submitImageButton";

export default function DailyChallenge() {

	return (
		<div className="min-h-screen flex flex-col items-center justify-start w-full">
			<div className="pt-4 pb-4 text-center">
				<div className="flex flex-col sm:flex-row items-center justify-center">
					<MapPin className="h-10 w-10 text-white sm:mr-4 mr-0" />
					<h1 className="text-3xl font-bold text-white sm:text-4xl">UTSCdle</h1>
				</div>
				<p className="mt-3 text-lg text-gray-300">
					Submit an image!
				</p>
			</div>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="picture">Select image from device</Label>
				<Input id="picture" type="file" />
			</div>
			<div className="flex flex-col w-full items-center p-4 bg-[#424242] rounded-xl mb-4 mr-6 mt-5">
				<MapProvider>
					<div className="mb-5">
						Select the image's location on the map
					</div>
					<div className="w-full sm:w-[500px] h-[500px] mt-4 sm:mt-0">
						<MapComponentSI />
					</div>
				</MapProvider>
			</div>
			<SubmitImageButton />

		</div>
	);
}
