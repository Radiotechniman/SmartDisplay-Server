import dayjs from 'dayjs';

import { SmartDisplayController } from '../smart-display-controller';

export class DrawHelper {
    static renderWeekday(controller: SmartDisplayController): void {
        const currentWeekday = dayjs().weekday();
        const getXPositionByWeekDay = (weekday: number) => weekday * 4 + 2;

        for (let weekday = 0; weekday < 7; weekday++) {
            const xPosition = getXPositionByWeekDay(weekday);
            const color = weekday === currentWeekday ? '#00C8C8' : '#A0A0A0';

            controller.drawLine(
                { x: xPosition, y: 7 },
                { x: xPosition + 2, y: 7 },
                color
            );
        }
    }

    static renderProgressbar(
        controller: SmartDisplayController,
        value: number | null | undefined,
        maxValue: number,
        hexColor = '#A0A0A0'
    ): void {
        const xEndPosition = this.calcProgressXPosition(value, maxValue);

        if (xEndPosition == null) {
            return;
        }

        controller.drawLine(
            { x: 2, y: 7 },
            { x: xEndPosition, y: 7 },
            hexColor
        );
    }

    static renderPixelProgress(
        controller: SmartDisplayController,
        value: number | null,
        maxValue: number,
        hexColor: string = '#A0A0A0'
    ): void {
        const xPosition = this.calcProgressXPosition(value, maxValue);

        if (xPosition == null) {
            return;
        }

        controller.drawPixel({ x: xPosition, y: 7 }, hexColor);
    }

    private static calcProgressXPosition(
        value: number | null | undefined,
        maxValue: number
    ): number | undefined {
        if (value == null) {
            return;
        }

        const percentValue = value / maxValue;
        const xPosition = 2 + Math.round(26 * percentValue);

        return xPosition;
    }
}
