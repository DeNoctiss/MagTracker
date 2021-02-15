import requests
import json
from requests.exceptions import HTTPError

for url in ['http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude=21.0328&longitude=-86.8709&altitude=3&date=2020-12-11&format=json','http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude=21.0328&longitude=-86.8709&altitude=3&date=2020-12-11&format=json','http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude=21.0328&longitude=-86.8709&altitude=3&date=2020-12-11&format=json']:
	try:
		response = requests.get(url)
		# если ответ успешен, исключения задействованы не будут
		response.raise_for_status()
		print()
		print()
		print()
		#print(response.text)
		data = json.loads(response.text)
		print(data["geomagnetic-field-model-result"]['model'])
	except HTTPError as http_err:
		print(f'HTTP error occurred: {http_err}')  # Python 3.6
	except Exception as err:
		print(f'Other error occurred: {err}')  # Python 3.6
	else:
		print('Success!')

