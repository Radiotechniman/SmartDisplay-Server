import mqtt from 'mqtt';
import Color from 'color';

import {
    RoomWeather,
    ControllerInfo,
    ControllerSettings,
    DrawTextData,
    DrawTextDataEasy,
    LastUpdated
} from './models';

export class SmartDisplayController {
    private readonly info = new LastUpdated<ControllerInfo>();
    private readonly roomWeather = new LastUpdated<RoomWeather>();
    private readonly lux = new LastUpdated<number>();

    constructor(private client: mqtt.Client) {
        client
            .on('message', (topic, message) => {
                if (!topic.startsWith('smart-display/client/out/')) {
                    return;
                }

                const parts = topic.split('/');
                const lastPart = parts[parts.length - 1];

                this.processIncomingMessage(lastPart, message.toString());
            })
            .subscribe('smart-display/client/out/#');
    }

    private processIncomingMessage(command: string, message: string) {
        console.log('process', command, message);

        switch (command) {
            case 'info': {
                this.info.value = JSON.parse(message);
                break;
            }
            case 'lux': {
                this.lux.value = parseInt(message, 10);
                break;
            }
            case 'roomWeather': {
                this.roomWeather.value = JSON.parse(message);
                break;
            }
        }
    }

    getInfo(): ControllerInfo | null {
        this.client.publish('smartDisplay/client/in/info', '');

        return null;
    }

    getRoomWeather(): RoomWeather | null {
        this.client.publish('smart-display/client/in/roomWeather', '');

        return null;
    }

    getLux(): number | null {
        this.client.publish('smartDisplay/client/in/lux', '');

        return null;
    }

    changeSettings(settings: ControllerSettings): void {
        this.client.publish(
            'smartDisplay/client/in/changeSettings',
            JSON.stringify(settings)
        );
    }

    show(): void {
        this.client.publish('smartDisplay/client/in/show', '');
    }

    clear(): void {
        this.client.publish('smartDisplay/client/in/clear', '');
    }

    drawText(data: DrawTextDataEasy): void {
        const color = Color(data.hexColor);
        const dataOut: DrawTextData = {
            text: data.text,
            x: data.position.x,
            y: data.position.y,
            color: color.rgb().array(),
            font: data.fontWeight
        };

        this.client.publish(
            'smartDisplay/client/in/drawText',
            JSON.stringify(dataOut)
        );
    }

    fill(hexColor: string): void {
        const color = Color(hexColor);
        const dataOut = {
            color: color.rgb()
        };

        this.client.publish(
            'smartDisplay/client/in/fill',
            JSON.stringify(dataOut)
        );
    }

    destroy(): void {
        this.client.end(true);
    }
}