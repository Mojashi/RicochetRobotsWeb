package twitter

import (
	"encoding/base64"
	"io/ioutil"
	"math"
	"os"

	"github.com/ChimeraCoder/anaconda"
	"github.com/Mojashi/RicochetRobots/api/utils"
)

type TwitterAPI struct {
	activityURL string
	CRCCheckURL string

	ConsumerKey    string
	ConsumerSecret string

	*anaconda.TwitterApi
}

func NewTwitterAPI() TwitterAPI {
	tw := TwitterAPI{
		ConsumerKey:    os.Getenv("CONSUMER_KEY"),
		ConsumerSecret: os.Getenv("CONSUMER_SECRET"),

		TwitterApi: anaconda.NewTwitterApiWithCredentials(
			os.Getenv("TWACCESS_TOKEN"),
			os.Getenv("TWACCESS_SECRET"),
			os.Getenv("CONSUMER_KEY"),
			os.Getenv("CONSUMER_SECRET"),
		),
	}

	return tw
}

func (api TwitterAPI) UploadImage(path string) (anaconda.Media, error) {
	media, err := api.UploadMedia(utils.EncodeBase64(path))
	if err != nil {
		return media, err
	}
	return media, nil
}

func (api TwitterAPI) UploadGif(path string) (*anaconda.VideoMedia, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var media anaconda.ChunkedMedia
	var videoMedia anaconda.VideoMedia

	media, err = api.UploadVideoInit(len(data), "image/gif")
	if err != nil {
		return nil, err
	}

	chunkIndex := 0
	for i := 0; i < len(data); i += 5242879 {
		err = api.UploadVideoAppend(media.MediaIDString, chunkIndex,
			base64.StdEncoding.EncodeToString(
				data[i:int(math.Min(5242879.0, float64(len(data))))],
			),
		)
		if err != nil {
			return nil, err
		}
		chunkIndex++
	}

	videoMedia, err = api.UploadVideoFinalize(media.MediaIDString)
	if err != nil {
		return nil, err
	}

	return &videoMedia, nil
}

type PostTwitterActivityRequest struct {
	UserID            string             `json:"for_user_id" form:"for_user_id" binding:"required"`
	TweetCreateEvents []TweetCreateEvent `json:"tweet_create_events" form:"tweet_create_events" binding:"required"`
}

type TweetCreateEvent struct {
	TweetIDStr string `json:"id_str" form:"id_str" binding:"required"`
	Text       string `json:"text" form:"text" binding:"required"`
	User       struct {
		IDStr      string `json:"id_str" form:"id_str" binding:"required"`
		ScreenName string `json:"screen_name" form:"screen_name" binding:"required"`
	} `json:"user" form:"user" binding:"required"`
}
