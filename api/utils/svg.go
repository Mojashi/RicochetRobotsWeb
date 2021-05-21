package utils

import (
	"image"
	"image/color"
	"image/draw"
	"image/gif"
	"image/png"
	"log"
	"math"
	"os"
	"sort"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/srwiley/oksvg"
	"github.com/srwiley/rasterx"
)

var mirrorImgs [][]*image.Paletted
var robotImgs []*image.Paletted
var wallImgs []*image.Paletted
var cellImg *image.Paletted
var goalImg *image.Paletted
var centerImg *image.Paletted
var paletteMap map[uint32]int
var palette []color.Color

const cellSize = 64

func init() {
	palette = []color.Color{}
	paletteMap = map[uint32]int{}
	makePalette([]string{"./img/cell", "./img/center", "./img/wall",
		"./img/robot1", "./img/robot2", "./img/robot3", "./img/robot4", "./img/robot5",
		"./img/mirror1", "./img/mirror2", "./img/mirror3", "./img/mirror4", "./img/mirror5",
		"./img/goal"})
	robotImgs = []*image.Paletted{
		ReadSVG("./img/robot1", 0.8),
		ReadSVG("./img/robot2", 0.8),
		ReadSVG("./img/robot3", 0.8),
		ReadSVG("./img/robot4", 0.8),
		ReadSVG("./img/robot5", 0.8),
	}
	mirrorImgs = [][]*image.Paletted{{
		ReadSVG("./img/mirror1", 1),
		ReadSVG("./img/mirror2", 1),
		ReadSVG("./img/mirror3", 1),
		ReadSVG("./img/mirror4", 1),
		ReadSVG("./img/mirror5", 1),
	}}
	mirrorImgs = append(mirrorImgs, []*image.Paletted{
		Affine(mirrorImgs[0][0], 90, mirrorImgs[0][0].Bounds().Max.X-1, 0, 1),
		Affine(mirrorImgs[0][1], 90, mirrorImgs[0][0].Bounds().Max.X-1, 0, 1),
		Affine(mirrorImgs[0][2], 90, mirrorImgs[0][0].Bounds().Max.X-1, 0, 1),
		Affine(mirrorImgs[0][3], 90, mirrorImgs[0][0].Bounds().Max.X-1, 0, 1),
		Affine(mirrorImgs[0][4], 90, mirrorImgs[0][0].Bounds().Max.X-1, 0, 1),
	})
	centerImg = ReadSVG("./img/center", 1)
	cellImg = ReadSVG("./img/cell", 1)
	bwallImg := ReadSVG("./img/wall", 1)
	goalImg = ReadSVG("./img/goal", 1)
	wallImgs = []*image.Paletted{
		bwallImg,
		Affine(bwallImg, 90, bwallImg.Bounds().Max.X-1, 0, 1),
		Affine(bwallImg, 180, bwallImg.Bounds().Max.X-1, bwallImg.Bounds().Max.Y-1, 1),
		Affine(bwallImg, 270, 0, bwallImg.Bounds().Max.Y-1, 1),
	}
}

func colorToUINT32(c color.RGBA) uint32 {
	r := c.R
	g := c.G
	b := c.B
	a := c.A

	return (uint32(r) << 24) + (uint32(g) << 16) + (uint32(b) << 8) + uint32(a)
}

func UINT32ToColor(a uint32) color.RGBA {
	R := uint8((a >> 24) & uint32(255))
	G := uint8((a >> 16) & uint32(255))
	B := uint8((a >> 8) & uint32(255))
	A := uint8((a) & uint32(255))
	return color.RGBA{R: R, G: G, B: B, A: A}
}

func makePalette(pathWithoutExt []string) {
	colorCounter := map[uint32]int{}
	uipalette := []uint32{}

	for _, fname := range pathWithoutExt {
		in, err := os.Open(fname + ".svg")
		if err != nil {
			panic(err)
		}
		defer in.Close()

		icon, _ := oksvg.ReadIconStream(in)
		w := int(icon.ViewBox.W)
		h := int(icon.ViewBox.H)

		icon.SetTarget(0, 0, float64(icon.ViewBox.W), float64(icon.ViewBox.H))
		r := image.NewRGBA(image.Rect(0, 0, w, h))
		icon.Draw(rasterx.NewDasher(w, h, rasterx.NewScannerGV(w, h, r, r.Bounds())), 1)

		for i := 0; len(r.Pix) > i; i += 4 {
			a := colorToUINT32(color.RGBA{R: r.Pix[i], G: r.Pix[i+1], B: r.Pix[i+2], A: r.Pix[i+3]})
			if a != colorToUINT32(UINT32ToColor(a)) {
				log.Println(UINT32ToColor(a))
				log.Println(color.RGBA{R: r.Pix[i], G: r.Pix[i+1], B: r.Pix[i+2], A: r.Pix[i+3]})
				panic("aaaa")
			}
			if _, ok := colorCounter[a]; !ok {
				uipalette = append(uipalette, a)
			}
			colorCounter[a]++
		}
	}

	sort.Slice(uipalette, func(i, j int) bool { return colorCounter[uipalette[i]] > colorCounter[uipalette[j]] })
	for i := 0; Min(256, len(uipalette)) > i; i++ {
		palette = append(palette, UINT32ToColor(uipalette[i]))
		paletteMap[uipalette[i]] = i
	}

	trns := color.RGBA{0xff, 0xff, 0xff, 0xff}
	if _, ok := paletteMap[colorToUINT32(trns)]; !ok {
		if len(palette) < 256 {
			paletteMap[colorToUINT32(trns)] = len(palette)
			palette = append(palette, trns)
		} else {
			delete(paletteMap, uipalette[len(palette)-1])

			palette[255] = trns
			paletteMap[colorToUINT32(trns)] = 255
		}
	}
}

func ReadSVG(pathWithoutExt string, scale float64) *image.Paletted {
	in, err := os.Open(pathWithoutExt + ".svg")
	if err != nil {
		panic(err)
	}
	defer in.Close()

	icon, _ := oksvg.ReadIconStream(in)
	w := int(cellSize * scale)
	h := int(cellSize * scale)

	icon.SetTarget(0, 0, float64(w), float64(h))
	r := image.NewPaletted(image.Rect(0, 0, w, h), palette)
	icon.Draw(rasterx.NewDasher(w, h, rasterx.NewScannerGV(w, h, r, r.Bounds())), 1)
	return r
}

func DrawCell(dst draw.Image, b model.Board, x, y int) {
	if x < 0 || y < 0 || x >= b.Width || y >= b.Height {
		return
	}
	rect := image.Rect(x*cellSize, y*cellSize, (x+1)*cellSize, (y+1)*cellSize)

	if (y == b.Height/2 || y == b.Height/2-1) && (x == b.Width/2 || x == b.Width/2-1) {
		draw.Draw(dst, rect, centerImg, image.Point{Y: 0, X: 0}, draw.Over)
		return
	}

	draw.Draw(dst, rect, cellImg, image.Point{Y: 0, X: 0}, draw.Over)
	for k := 0; 4 > k; k++ {
		if b.Cells[y][x].Walls[k] {
			draw.Draw(dst, rect, wallImgs[k], image.Point{Y: 0, X: 0}, draw.Over)
		}
		if b.Cells[y][x].Goal {
			draw.Draw(dst, rect, goalImg, image.Point{Y: 0, X: 0}, draw.Over)
		}
		if b.Cells[y][x].Mirror != nil {
			m := b.Cells[y][x].Mirror
			draw.Draw(dst, rect, mirrorImgs[m.Side][m.Trans], image.Point{Y: 0, X: 0}, draw.Over)
		}
	}
}

func DrawBoard(b model.Board) *image.Paletted {
	w := cellSize * b.Width
	h := cellSize * b.Height
	dst := image.NewPaletted(image.Rect(0, 0, w, h), palette)

	for i := 0; b.Height > i; i++ {
		for j := 0; b.Width > j; j++ {
			DrawCell(dst, b, j, i)
		}
	}
	return dst
}

func DrawProblem(path string, p model.Problem) {
	boardImg := DrawBoard(p.Board)
	DrawRobot(p.MainRobot, float64(p.Board.Height)/2-0.5, float64(p.Board.Width)/2-0.5, boardImg)

	poss := make(model.Poss, len(p.RobotPoss))
	copy(poss, p.RobotPoss)

	firstImg := image.NewPaletted(boardImg.Rect, palette)
	draw.Draw(firstImg, firstImg.Rect, boardImg, image.Point{Y: 0, X: 0}, draw.Over)
	DrawRobots(poss, firstImg)

	f, _ := os.Create(path)
	defer f.Close()
	err := png.Encode(f, firstImg)
	if err != nil {
		panic(err)
	}
}

func DrawSolution(path string, p model.Problem, hands model.Hands) {
	if !p.IsValid(hands) {
		return
	}
	boardImg := DrawBoard(p.Board)
	DrawRobot(p.MainRobot, float64(p.Board.Height)/2-0.5, float64(p.Board.Width)/2-0.5, boardImg)

	poss := make(model.Poss, len(p.RobotPoss))
	copy(poss, p.RobotPoss)

	firstImg := image.NewPaletted(boardImg.Rect, palette)
	draw.Draw(firstImg, firstImg.Rect, boardImg, image.Point{Y: 0, X: 0}, draw.Over)
	DrawRobots(poss, firstImg)

	images := []*image.Paletted{firstImg}

	for _, hand := range hands {
		bef := poss[hand.Robot]
		bh := hand
		for p.Board.Move(poss, &hand) {
			if Abs(bef.X-poss[hand.Robot].X)+Abs(bef.Y-poss[hand.Robot].Y) > 1 {
				mid := model.AddVec(hand.Dir, bef)
				images = linearInterpolate(images, p.Board, boardImg.Rect, bef, mid, bh.Robot, 2)
				mid = model.AddVec(model.InvDir(bh.Dir), poss[hand.Robot])
				images = linearInterpolate(images, p.Board, boardImg.Rect, mid, poss[hand.Robot], hand.Robot, 2)
			} else {
				images = linearInterpolate(images, p.Board, boardImg.Rect, bef, poss[hand.Robot], hand.Robot, 2)
			}
			bef = poss[hand.Robot]
			bh = hand
		}
	}
	f, _ := os.Create(path)

	delays := make([]int, len(images))
	for i := 0; len(delays) > i; i++ {
		delays[i] = 5
	}
	defer f.Close()
	err := gif.EncodeAll(f, &gif.GIF{
		Image: images,
		Delay: delays,
	})
	if err != nil {
		panic(err)
	}
}

func linearInterpolate(images []*image.Paletted, b model.Board, rect image.Rectangle, from model.Pos, to model.Pos, idx int, part int) []*image.Paletted {
	for i := 1; part >= i; i++ {
		dst := image.NewPaletted(rect, palette)
		DrawCell(dst, b, from.X, from.Y)
		DrawCell(dst, b, to.X, to.Y)
		DrawRobot(idx, float64(i)*float64(to.X-from.X)/float64(part)+float64(from.X), float64(i)*float64(to.Y-from.Y)/float64(part)+float64(from.Y), dst)
		images = append(images, dst)
	}
	return images
}

func DrawRobot(idx int, x float64, y float64, dst draw.Image) {
	centerX := x*cellSize + cellSize/2
	centerY := y*cellSize + cellSize/2
	rimg := robotImgs[idx]
	draw.Draw(
		dst,
		image.Rect(
			int(math.Round(centerX-float64(rimg.Bounds().Dx())/2.0)), int(math.Round(centerY-float64(rimg.Bounds().Dy())/2.0)),
			int(math.Round(centerX+float64(rimg.Bounds().Dx())/2.0)), int(math.Round(centerY+float64(rimg.Bounds().Dy())/2.0)),
		),
		rimg, image.Point{X: 0, Y: 0}, draw.Over)
}
func DrawRobots(poss model.Poss, dst draw.Image) {
	for idx, pos := range poss {
		DrawRobot(idx, float64(pos.X), float64(pos.Y), dst)
	}
}

func Affine(inputImage image.Image, angle int, tx int, ty int, scale float64) *image.Paletted {

	// 出力画像を定義
	size := inputImage.Bounds()
	size.Max.X = int(float64(size.Max.X) * scale)
	size.Max.Y = int(float64(size.Max.Y) * scale)

	outputImage := image.NewPaletted(size, palette)

	// ステータスのキャスト
	theta := float64(angle) * math.Pi / 180
	cos := math.Cos(theta)
	sin := math.Sin(theta)

	matrix := [][]float64{{cos * scale, -sin * scale, float64(tx)}, {sin * scale, cos * scale, float64(ty)}, {0.0, 0.0, 1.0}}

	// 左右反転
	for y := size.Min.Y; y < size.Max.Y; y++ {
		for x := size.Min.X; x < size.Max.X; x++ {

			outputX := 0
			outputY := 0
			// 元座標を格納
			origin := []float64{float64(x), float64(y), 1.0}

			// 座標を計算
			for rowKey, rowVal := range matrix {
				var val float64

				for colIndex := 0; colIndex < len(rowVal); colIndex++ {

					val += origin[colIndex] * rowVal[colIndex]
				}

				// 座標の代入
				switch rowKey {
				case 0:
					outputX = int(math.Round(val))
					break
				case 1:
					outputY = int(math.Round(val))
					break
				default:
					break
				}

			}

			if size.Min.X <= outputX && outputX < size.Max.X && size.Min.Y <= outputY && outputY < size.Max.Y {
				outputImage.Set(outputX, outputY, inputImage.At(x, y))
			} else {
				// 何もしない
			}
		}
	}

	return outputImage
}
